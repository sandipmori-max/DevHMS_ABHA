import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppDispatch } from '../../../store/hooks';
import { getERPListDataThunk } from '../../../store/slices/auth/thunk';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import {
  getERPField,
  matchesERPPatient,
  normalizeERPKey,
  parseERPListRows,
  type ERPRecord,
} from '../../utils/erpRecords';
import { getErrorMessage } from '../../utils/helpers';
import { showToast } from '../../utils/toast';

type CareContextStatus = 'Linked' | 'Pending' | 'Failed';

type CareContext = {
  id: string;
  requestId: string;
  referenceId: string;
  displayName: string;
  hiType: string;
  createdAt: string;
  linkedAt: string;
  status: CareContextStatus;
  errorMessage: string;
};

interface CareContextsProps {
  patientId?: string;
  abhaDetail: Array<{ field: string; text: string }>;
}

const STATUS_FILTERS = [
  { key: 'all', title: 'All' },
  { key: 'linked', title: 'Linked' },
  { key: 'pending', title: 'Pending' },
  { key: 'failed', title: 'Failed' },
];

const getStatus = (value: unknown): CareContextStatus => {
  const status = String(value ?? '').trim().toUpperCase();
  if (['LINKED', 'SUCCESS', 'COMPLETED', 'GRANTED'].includes(status)) {
    return 'Linked';
  }
  if (['FAILED', 'ERROR', 'DENIED'].includes(status)) {
    return 'Failed';
  }
  return 'Pending';
};

const parseContextPayload = (value: unknown): ERPRecord[] => {
  let parsed = value;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new Error('A saved care-context record contains invalid JSON.');
    }
  }
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((group): ERPRecord[] => {
    if (!group || typeof group !== 'object' || Array.isArray(group)) {
      return [];
    }
    const parent = group as ERPRecord;
    const children = getERPField(parent, ['carecontexts']);
    if (!Array.isArray(children)) {
      return [parent];
    }
    return children
      .filter(
        (child): child is ERPRecord =>
          Boolean(child) && typeof child === 'object' && !Array.isArray(child),
      )
      .map(child => ({
        ...child,
        hiType: getERPField(child, ['hiType']) ?? getERPField(parent, ['hiType']),
      }));
  });
};

const dedupeLinkRequests = (rows: ERPRecord[]) => {
  const latest = new Map<
    string,
    { row: ERPRecord; updatedAt: number; index: number }
  >();
  const rowsWithoutId: ERPRecord[] = [];

  rows.forEach((row, index) => {
    const requestId = String(getERPField(row, ['requestid']) ?? '').trim();
    if (!requestId) {
      rowsWithoutId.push(row);
      return;
    }
    const updatedAt = Date.parse(String(
      getERPField(row, ['completedat']) ||
      getERPField(row, ['updatedat']) ||
      getERPField(row, ['linkedat']) ||
      getERPField(row, ['createdat']) ||
      '',
    )) || 0;
    const previous = latest.get(requestId);
    if (!previous || updatedAt >= previous.updatedAt) {
      latest.set(requestId, { row, updatedAt, index });
    }
  });

  return [
    ...rowsWithoutId,
    ...[...latest.values()]
      .sort((left, right) => left.index - right.index)
      .map(item => item.row),
  ];
};

const expandCareContexts = (rows: ERPRecord[]): CareContext[] =>
  dedupeLinkRequests(rows).flatMap((row, rowIndex) => {
    const requestId = String(getERPField(row, ['requestid']) ?? '').trim();
    const savedContexts = parseContextPayload(
      getERPField(row, ['carecontexts', 'contexts']),
    );
    const contextRecords = savedContexts.length > 0
      ? savedContexts
      : getERPField(row, ['referencenumber', 'referenceid', 'carecontextid'])
        ? [row]
        : [];
    const status = getStatus(
      getERPField(row, ['status']) || getERPField(row, ['linkstatus']),
    );

    return contextRecords.map((context, contextIndex) => {
      const referenceId = String(
        getERPField(context, ['referencenumber', 'referenceid', 'carecontextid']) ?? '',
      ).trim();
      const hiType = String(
        getERPField(context, ['hitype', 'type']) ??
        getERPField(row, ['hitype']) ??
        'Health record',
      );
      return {
        id: `${requestId || rowIndex}-${referenceId || contextIndex}`,
        requestId,
        referenceId: referenceId || requestId || 'Care context',
        displayName: String(
          getERPField(context, ['display', 'displayname', 'name']) ??
          referenceId ??
          'Care context',
        ),
        hiType,
        createdAt: String(
          getERPField(row, ['createdat', 'requestedat']) ?? '',
        ),
        linkedAt: String(
          getERPField(row, ['completedat']) ||
          getERPField(row, ['linkedat']) ||
          '',
        ),
        status,
        errorMessage: String(getERPField(row, ['errormessage', 'error']) ?? ''),
      };
    });
  });

const formatDate = (value: string) => {
  if (!value) {
    return '-';
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString();
};

const CareContexts: React.FC<CareContextsProps> = ({
  patientId,
  abhaDetail,
}) => {
  const dispatch = useAppDispatch();
  const [contexts, setContexts] = useState<CareContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getProfileValue = useCallback((fieldName: string) => {
    const normalized = normalizeERPKey(fieldName);
    return (
      abhaDetail.find(item => normalizeERPKey(item.field) === normalized)?.text ??
      ''
    ).trim();
  }, [abhaDetail]);

  const address =
    getProfileValue('preferredabhaaddress') ||
    getProfileValue('abhaaddress');
  const abhaNumber = getProfileValue('abhanumber').replace(/\D/g, '');
  const patientReferences = [
    String(patientId ?? '').trim(),
    getProfileValue('patientabhaid'),
  ];

  const loadCareContexts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await dispatch(getERPListDataThunk({
        page: 'Linkcarecontextrequest',
        fromDate: '',
        toDate: '',
        param: '',
        branch: '',
      })).unwrap();
      const rows = parseERPListRows(response, 'care context')
        .filter(row =>
          matchesERPPatient(row, { address, abhaNumber, patientReferences }),
        );
      setContexts(expandCareContexts(rows));
    } catch (loadError) {
      const message = getErrorMessage(loadError);
      setError(message);
      showToast('error', 'Care Context List Failed', message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [abhaNumber, address, dispatch, patientReferences.join('|')]);

  useEffect(() => {
    void loadCareContexts();
  }, [loadCareContexts]);

  const visibleContexts = useMemo(
    () => selectedFilter === 'all'
      ? contexts
      : contexts.filter(
          context => context.status.toLowerCase() === selectedFilter,
        ),
    [contexts, selectedFilter],
  );

  const renderItem = ({ item }: { item: CareContext }) => (
    <CareContextCard context={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <SummaryItem
          value={contexts.filter(item => item.status === 'Linked').length}
          label="Linked"
          type="linked"
        />
        <SummaryItem
          value={contexts.filter(item => item.status === 'Pending').length}
          label="Pending"
          type="pending"
        />
        <SummaryItem
          value={contexts.filter(item => item.status === 'Failed').length}
          label="Failed"
          type="failed"
        />
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map(filter => (
          <FilterChip
            key={filter.key}
            title={filter.title}
            active={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isLoading || refreshing}
        onPress={() => void loadCareContexts(true)}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshText}>Refresh care contexts</Text>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator
          color={ERP_COLOR_CODE.ERP_APP_COLOR}
          style={{ marginVertical: 36 }}
        />
      ) : error && contexts.length === 0 ? (
        <View style={styles.loadError}>
          <Text style={styles.emptyDescription}>{error}</Text>
          <Pressable
            onPress={() => void loadCareContexts()}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : visibleContexts.length === 0 ? (
        <EmptyState
          description={
            contexts.length === 0
              ? 'No saved care-context links were found for this patient.'
              : `No ${selectedFilter} care-context links were found for this patient.`
          }
        />
      ) : (
        <FlatList
          data={visibleContexts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => void loadCareContexts(true)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

interface CareContextCardProps {
  context: CareContext;
}

const CareContextCard: React.FC<CareContextCardProps> = ({ context }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.leftSection}>
        <View style={styles.contextIcon}>
          <Text style={styles.contextIconText}>▣</Text>
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.referenceId} numberOfLines={1}>
            {context.referenceId}
          </Text>
          <Text style={styles.displayName} numberOfLines={2}>
            {context.displayName}
          </Text>
        </View>
      </View>
      <StatusBadge status={context.status} />
    </View>

    <View style={styles.detailsContainer}>
      <DetailRow icon="📄" label="Health information type" value={context.hiType} />
      <DetailRow icon="🔗" label="Link request" value={context.requestId || '-'} />
    </View>

    <View style={styles.documentRow}>
      <Text style={styles.dateText}>Requested: {formatDate(context.createdAt)}</Text>
      {context.linkedAt ? (
        <Text style={styles.dateText}>Linked: {formatDate(context.linkedAt)}</Text>
      ) : null}
    </View>

    {context.status === 'Failed' && context.errorMessage ? (
      <Text style={styles.failedInfo}>{context.errorMessage}</Text>
    ) : null}

  </View>
);

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

const StatusBadge = ({ status }: { status: CareContextStatus }) => {
  const statusConfig = {
    Linked: { background: '#ECFDF3', text: '#027A48', dot: '#12B76A' },
    Pending: { background: '#FFFAEB', text: '#B54708', dot: '#F79009' },
    Failed: { background: '#FEF3F2', text: '#B42318', dot: '#F04438' },
  };
  const config = statusConfig[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.background }]}>
      <View style={[styles.statusDot, { backgroundColor: config.dot }]} />
      <Text style={[styles.statusText, { color: config.text }]}>{status}</Text>
    </View>
  );
};

const SummaryItem = ({
  value,
  label,
  type,
}: {
  value: number;
  label: string;
  type: 'linked' | 'pending' | 'failed';
}) => (
  <View style={styles.summaryItem}>
    <Text
      style={[
        styles.summaryValue,
        type === 'linked' && styles.linkedSummary,
        type === 'pending' && styles.pendingSummary,
        type === 'failed' && styles.failedSummary,
      ]}
    >
      {value}
    </Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const FilterChip = ({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.filterChip, active && styles.activeFilterChip]}
  >
    <Text style={[styles.filterText, active && styles.activeFilterText]}>
      {title}
    </Text>
  </Pressable>
);

const EmptyState = ({ description }: { description: string }) => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <Text style={styles.emptyIconText}>+</Text>
    </View>
    <Text style={styles.emptyTitle}>No Care Contexts</Text>
    <Text style={styles.emptyDescription}>
      {description}
    </Text>
  </View>
);

export default CareContexts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#667085',
    fontSize: 12,
    marginTop: 4,
  },
  linkedSummary: { color: '#027A48' },
  pendingSummary: { color: '#B54708' },
  failedSummary: { color: '#B42318' },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterChip: {
    borderColor: '#D7DDE5',
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activeFilterChip: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
  filterText: {
    color: '#5F6368',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: { color: '#FFFFFF' },
  refreshButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  refreshText: {
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
    fontWeight: '600',
  },
  loadError: {
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: { height: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAECF0',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 14,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
  },
  contextIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    marginRight: 10,
    width: 42,
  },
  contextIconText: {
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
    fontSize: 20,
  },
  titleSection: { flex: 1 },
  referenceId: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '600',
  },
  displayName: {
    color: '#101828',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 7,
    marginRight: 5,
    width: 7,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsContainer: {
    borderTopColor: '#F2F4F7',
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 8,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 9,
    width: 22,
  },
  detailTextContainer: { flex: 1 },
  detailLabel: {
    color: '#667085',
    fontSize: 11,
  },
  detailValue: {
    color: '#344054',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  documentRow: {
    borderTopColor: '#F2F4F7',
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 10,
  },
  dateText: {
    color: '#667085',
    fontSize: 11,
    marginBottom: 3,
  },
  failedInfo: {
    color: '#B42318',
    fontSize: 12,
    marginTop: 8,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  emptyIconText: {
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
    fontSize: 28,
  },
  emptyTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyDescription: {
    color: '#667085',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
