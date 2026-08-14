import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type CareContextStatus =
  | 'Linked'
  | 'Pending'
  | 'Failed';

type CareContext = {
  id: string;
  referenceId: string;
  displayName: string;

  visitId: string;
  visitType: 'OPD' | 'IPD' | 'Emergency';

  department: string;
  doctor: string;

  documentsCount: number;

  createdAt: string;
  linkedAt?: string;

  status: CareContextStatus;
};

interface CareContextsProps {
  onCreateCareContext?: () => void;

  onContextPress?: (
    context: CareContext,
  ) => void;

  onLinkPress?: (
    context: CareContext,
  ) => void;
}

const CARE_CONTEXTS: CareContext[] = [
  {
    id: '1',
    referenceId: 'CC-2026-001',
    displayName: 'Cardiology OPD',

    visitId: 'V1001',
    visitType: 'OPD',

    department: 'Cardiology',
    doctor: 'Dr. Patel',

    documentsCount: 3,

    createdAt: '14 Aug 2026, 10:15 AM',
    linkedAt: '14 Aug 2026, 10:32 AM',

    status: 'Linked',
  },

  {
    id: '2',
    referenceId: 'CC-2026-002',
    displayName: 'General OPD',

    visitId: 'V0987',
    visitType: 'OPD',

    department: 'General Medicine',
    doctor: 'Dr. Sharma',

    documentsCount: 2,

    createdAt: '02 Aug 2026, 12:10 PM',

    status: 'Pending',
  },

  {
    id: '3',
    referenceId: 'CC-2026-003',
    displayName: 'ENT Consultation',

    visitId: 'V0876',
    visitType: 'OPD',

    department: 'ENT',
    doctor: 'Dr. Mehta',

    documentsCount: 4,

    createdAt: '12 Jul 2026, 11:00 AM',
    linkedAt: '12 Jul 2026, 11:20 AM',

    status: 'Linked',
  },

  {
    id: '4',
    referenceId: 'CC-2026-004',
    displayName: 'Emergency Visit',

    visitId: 'V0765',
    visitType: 'Emergency',

    department: 'Emergency',
    doctor: 'Dr. Rao',

    documentsCount: 5,

    createdAt: '18 Jun 2026, 08:45 PM',

    status: 'Failed',
  },

  {
    id: '5',
    referenceId: 'CC-2026-005',
    displayName: 'Orthopedic Consultation',

    visitId: 'V0654',
    visitType: 'IPD',

    department: 'Orthopedics',
    doctor: 'Dr. Shah',

    documentsCount: 6,

    createdAt: '05 Jun 2026, 09:30 AM',

    status: 'Linked',
    linkedAt: '05 Jun 2026, 10:05 AM',
  },
];

const CareContexts: React.FC<
  CareContextsProps
> = ({
  onCreateCareContext,
  onContextPress,
  onLinkPress,
}) => {
  const [refreshing, setRefreshing] =
    useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const renderItem = ({
    item,
  }: {
    item: CareContext;
  }) => {
    return (
      <CareContextCard
        context={item}
        onPress={() =>
          onContextPress?.(item)
        }
        onLinkPress={() =>
          onLinkPress?.(item)
        }
      />
    );
  };

  const CARE_CONTEXT_STATUS_FILTERS = [
  {
    key: 'all',
    title: 'All',
  },
  {
    key: 'linked',
    title: 'Linked',
  },
  {
    key: 'pending',
    title: 'Pending',
  },
  {
    key: 'failed',
    title: 'Failed',
  },
];
const [selectedStatusFilter, setSelectedStatusFilter] =
  useState('all');

  return (
    <View style={styles.container}>

      {/* Header */}

     

      {/* Summary */}

      <View style={styles.summaryContainer}>
        <SummaryItem
          value={
            CARE_CONTEXTS.filter(
              item => item.status === 'Linked',
            ).length
          }
          label="Linked"
          type="linked"
        />

        <SummaryItem
          value={
            CARE_CONTEXTS.filter(
              item => item.status === 'Pending',
            ).length
          }
          label="Pending"
          type="pending"
        />

        <SummaryItem
          value={
            CARE_CONTEXTS.filter(
              item => item.status === 'Failed',
            ).length
          }
          label="Failed"
          type="failed"
        />
      </View>

      {/* Filter */}

     <View style={styles.filterRow}>
  {CARE_CONTEXT_STATUS_FILTERS.map(filter => (
    <FilterChip
      key={filter.key}
      title={filter.title}
      active={
        selectedStatusFilter === filter.key
      }
      onPress={() =>
        setSelectedStatusFilter(filter.key)
      }
    />
  ))}
</View>

      {/* List */}

      <FlatList
        data={CARE_CONTEXTS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        contentContainerStyle={
          CARE_CONTEXTS.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            onCreate={onCreateCareContext}
          />
        }
      />
    </View>
  );
};

interface CareContextCardProps {
  context: CareContext;
  onPress?: () => void;
  onLinkPress?: () => void;
}

const CareContextCard: React.FC<
  CareContextCardProps
> = ({
  context,
  onPress,
  onLinkPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      android_ripple={{
        color: '#EAF2FF',
      }}
    >
      {/* Card Header */}

      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <ContextIcon
            type={context.visitType}
          />

          <View style={styles.titleSection}>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceId}>
                {context.referenceId}
              </Text>

              <VisitTypeBadge
                type={context.visitType}
              />
            </View>

            <Text
              style={styles.displayName}
              numberOfLines={1}
            >
              {context.displayName}
            </Text>
          </View>
        </View>

        <StatusBadge
          status={context.status}
        />
      </View>

      {/* Details */}

      <View style={styles.detailsContainer}>

    

        <DetailRow
          icon="🪪"
          label="Visit"
          value={`${context.visitId} • ${context.visitType}`}
        />

        <DetailRow
          icon="👨‍⚕️"
          label="Doctor"
          value={context.doctor}
        />

        <DetailRow
          icon="🏥"
          label="Department"
          value={context.department}
        />

      </View>

      {/* Document */}

      <View style={styles.documentRow}>
        <View style={styles.documentLeft}>
          <View style={styles.documentIcon}>
            <Text style={styles.documentIconText}>
              📄
            </Text>
          </View>

          <Text style={styles.documentText}>
            {context.documentsCount}{' '}
            {context.documentsCount === 1
              ? 'Document'
              : 'Documents'}
          </Text>
        </View>

        <Text style={styles.dateText}>
          {context.createdAt}
        </Text>
      </View>

      {/* Footer */}

      <View style={styles.footer}>

        <View>
          {context.status ===
            'Linked' &&
            context.linkedAt && (
              <Text style={styles.linkedDate}>
                Linked: {context.linkedAt}
              </Text>
            )}

          {context.status ===
            'Pending' && (
            <Text style={styles.pendingInfo}>
              Ready to link with ABDM
            </Text>
          )}

          {context.status ===
            'Failed' && (
            <Text style={styles.failedInfo}>
              ABDM linking failed
            </Text>
          )}
        </View>

        <View style={styles.actionContainer}>

          {context.status ===
            'Pending' && (
            <Pressable
              onPress={event => {
                event.stopPropagation();
                onLinkPress?.();
              }}
              style={styles.linkButton}
              android_ripple={{
                color: '#D9E9FF',
              }}
            >
              <Text style={styles.linkButtonText}>
                Link to ABDM
              </Text>
            </Pressable>
          )}

          {context.status ===
            'Failed' && (
            <Pressable
              onPress={event => {
                event.stopPropagation();
                onLinkPress?.();
              }}
              style={styles.retryButton}
              android_ripple={{
                color: '#FFF0F0',
              }}
            >
              <Text style={styles.retryButtonText}>
                Retry
              </Text>
            </Pressable>
          )}

          <Text style={styles.arrow}>
            ›
          </Text>
        </View>

      </View>
    </Pressable>
  );
};

const ContextIcon = ({
  type,
}: {
  type: CareContext['visitType'];
}) => {
  return (
    <View
      style={[
        styles.contextIcon,
        type === 'Emergency' &&
          styles.emergencyContextIcon,
        type === 'IPD' &&
          styles.ipdContextIcon,
      ]}
    >
      <Text style={styles.contextIconText}>
        {type === 'Emergency'
          ? '✚'
          : type === 'IPD'
          ? '⌂'
          : '▣'}
      </Text>
    </View>
  );
};

const VisitTypeBadge = ({
  type,
}: {
  type: CareContext['visitType'];
}) => {
  return (
    <View
      style={[
        styles.visitTypeBadge,
        type === 'Emergency' &&
          styles.emergencyBadge,
        type === 'IPD' &&
          styles.ipdBadge,
      ]}
    >
      <Text
        style={[
          styles.visitTypeText,
          type === 'Emergency' &&
            styles.emergencyText,
        ]}
      >
        {type}
      </Text>
    </View>
  );
};

const StatusBadge = ({
  status,
}: {
  status: CareContextStatus;
}) => {
  const statusConfig = {
    Linked: {
      background: '#ECFDF3',
      text: '#027A48',
      dot: '#12B76A',
    },

    Pending: {
      background: '#FFFAEB',
      text: '#B54708',
      dot: '#F79009',
    },

    Failed: {
      background: '#FEF3F2',
      text: '#B42318',
      dot: '#F04438',
    },
  };

  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor:
            config.background,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: config.dot,
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          {
            color: config.text,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>
        {icon}
      </Text>

      <Text
        style={styles.detailValue}
        numberOfLines={1}
      >
        {value}
      </Text>
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
}) => {
  return (
    <View style={styles.summaryItem}>
      <Text
        style={[
          styles.summaryValue,
          type === 'linked' &&
            styles.linkedSummary,
          type === 'pending' &&
            styles.pendingSummary,
          type === 'failed' &&
            styles.failedSummary,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
};

const FilterChip = ({
  title,
  active = false,
  onPress,
}: {
  title: string;
  active?: boolean;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        active && styles.activeFilterChip,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const EmptyState = ({
  onCreate,
}: {
  onCreate?: () => void;
}) => {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>
          +
        </Text>
      </View>

      <Text style={styles.emptyTitle}>
        No Care Contexts
      </Text>

      <Text style={styles.emptyDescription}>
        Create a care context for this
        patient's visit to share health
        information with ABDM.
      </Text>

      <Pressable
        onPress={onCreate}
        style={styles.emptyButton}
      >
        <Text style={styles.emptyButtonText}>
          Create Care Context
        </Text>
      </Pressable>
    </View>
  );
};

export default CareContexts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  title: { 
    fontWeight: '700',
    color: '#101828',
  },

  subtitle: {
    marginTop: 3, 
    color: '#667085',
  },

  createButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createIcon: {
    color: '#FFFFFF', 
    lineHeight: 20,
    marginRight: 4,
  },

  createText: {
    color: '#FFFFFF', 
    fontWeight: '600',
  },

  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAECF0',
  },

  summaryItemLast: {
    borderRightWidth: 0,
  },

  summaryValue: { 
    fontWeight: '700',
    color: '#101828',
  },

  summaryLabel: {
    marginTop: 2, 
    color: '#667085',
    fontWeight: '500',
  },

  linkedSummary: {
    color: '#027A48',
  },

  pendingSummary: {
    color: '#B54708',
  },

  failedSummary: {
    color: '#B42318',
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  filterChip: {
    height: 28,
    paddingHorizontal: 13,
    borderRadius: 4,
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 0.4
  },

  activeFilterChip: {
    backgroundColor: '#1565C0',
  },

  filterText: { 
    fontWeight: '500',
    color: '#667085',
  },

  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  listContent: {
    paddingBottom: 24,
  },

  separator: {
    height: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    padding: 14,

    shadowColor: '#101828',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,

    elevation: 2,
  },

  cardPressed: {
    opacity: 0.85,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  leftSection: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },

  contextIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  ipdContextIcon: {
    backgroundColor: '#EEF4FF',
  },

  emergencyContextIcon: {
    backgroundColor: '#FFF0F0',
  },

  contextIconText: { 
    color: '#1565C0',
    fontWeight: '700',
  },

  titleSection: {
    flex: 1,
  },

  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  referenceId: { 
    fontWeight: '700',
    color: '#101828',
    marginRight: 7,
  },

  displayName: {
    marginTop: 4, 
    color: '#475467',
    fontWeight: '500',
     fontSize: 12

  },

  visitTypeBadge: {
    height: 20,
    paddingHorizontal: 7,
    borderRadius: 4,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
  },

  visitTypeText: { 
    fontWeight: '700',
     fontSize: 10,
    color: '#1565C0',
  },

  emergencyBadge: {
    backgroundColor: '#FEF3F2',
  },

  emergencyText: {
    color: '#D92D20',
  },

  ipdBadge: {
    backgroundColor: '#F2F4F7',
  },

  statusBadge: {
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    marginRight: 5,
  },

  statusText: { 
    fontWeight: '600',
     fontSize: 10

  },

  detailsContainer: {
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  detailIcon: {
    width: 25, 
  },

  detailLabel: {
    width: 100, 
    color: '#98A2B3',
    fontWeight: '500',
  },

  detailValue: {
    flex: 1, 
    color: '#475467',
    fontWeight: '600',
  },

  documentRow: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentIcon: {
    width: 27,
    height: 27,
    borderRadius: 4,
    backgroundColor: '#EFF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  documentIconText: {
    fontSize: 14,
  },

  documentText: { 
    fontWeight: '600',
    color: '#475467',
  },

  dateText: { 
    color: '#98A2B3',
     fontSize: 12

  },

  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  linkedDate: { 
    color: '#027A48',
    fontWeight: '500',
  },

  pendingInfo: { 
    color: '#B54708',
    fontWeight: '500',
  },

  failedInfo: { 
    color: '#B42318',
    fontWeight: '500',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  linkButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
  },

  linkButtonText: { 
    color: '#FFFFFF',
    fontWeight: '600',
  },

  retryButton: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
  },

  retryButtonText: { 
    color: '#B42318',
    fontWeight: '600',
  },

  arrow: {
    marginLeft: 9, 
    color: '#98A2B3',
    fontWeight: '300',
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 30,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIconText: {
    fontSize: 30,
    color: '#1565C0',
  },

  emptyTitle: {
    marginTop: 14, 
    fontWeight: '700',
    color: '#101828',
  },

  emptyDescription: {
    marginTop: 7, 
    lineHeight: 18,
    textAlign: 'center',
    color: '#667085',
  },

  emptyButton: {
    marginTop: 16,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
  },

  emptyButtonText: {
    color: '#FFFFFF', 
    fontWeight: '600',
  },
});