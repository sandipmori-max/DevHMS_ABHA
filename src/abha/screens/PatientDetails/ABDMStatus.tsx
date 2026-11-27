import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppDispatch } from '../../../store/hooks';
import { getERPListDataThunk } from '../../../store/slices/auth/thunk';
import {
  getERPField,
  matchesERPPatient,
  normalizeERPKey,
  parseERPListRows,
  type ERPRecord,
} from '../../utils/erpRecords';
import { getErrorMessage } from '../../utils/helpers';
import { showToast } from '../../utils/toast';

type StepStatus = 'success' | 'pending' | 'failed';
type ActivityType = 'care' | 'consent';

interface ABDMStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: StepStatus;
  icon: ActivityType;
  timestamp: number;
  referenceId: string;
}

interface ABDMStatusProps {
  patientName?: string;
  patientId?: string;
  abhaAddress?: string;
  abhaNumber?: string;
  abhaDetail: Array<{ field: string; text: string }>;
}

const normalizeStatus = (value: unknown) =>
  String(value ?? '').trim().toUpperCase();

const getLinkStepStatus = (value: unknown): StepStatus => {
  const status = normalizeStatus(value);
  if (
    ['LINKED', 'SUCCESS', 'COMPLETED', 'GRANTED'].includes(status) ||
    status.includes('SUCCESSFULLY LINKED')
  ) {
    return 'success';
  }
  if (['FAILED', 'ERROR', 'DENIED'].includes(status)) {
    return 'failed';
  }
  return 'pending';
};

const getConsentStepStatus = (value: unknown): StepStatus => {
  const status = normalizeStatus(value);
  if (['GRANTED', 'APPROVED'].includes(status)) {
    return 'success';
  }
  if (['DENIED', 'EXPIRED', 'REVOKED', 'FAILED', 'ERROR'].includes(status)) {
    return 'failed';
  }
  return 'pending';
};

const formatDate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return '-';
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString();
};

const getTimestamp = (value: unknown) => {
  if (typeof value !== 'string') {
    return 0;
  }
  return Date.parse(value) || 0;
};

const dedupeRequests = (
  rows: ERPRecord[],
  timeFields: string[],
): ERPRecord[] => {
  const latest = new Map<string, { row: ERPRecord; timestamp: number }>();
  const rowsWithoutId: ERPRecord[] = [];

  rows.forEach(row => {
    const requestId = String(getERPField(row, ['requestid']) ?? '').trim();
    if (!requestId) {
      rowsWithoutId.push(row);
      return;
    }

    const timestamp = timeFields.reduce<number>((latestTimestamp, field) => {
      const fieldTimestamp = getTimestamp(getERPField(row, [field]));
      return fieldTimestamp || latestTimestamp;
    }, 0);
    const previous = latest.get(requestId);
    if (!previous || timestamp >= previous.timestamp) {
      latest.set(requestId, { row, timestamp });
    }
  });

  return [...rowsWithoutId, ...[...latest.values()].map(item => item.row)];
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ABDMStatus: React.FC<ABDMStatusProps> = ({
  patientName,
  patientId,
  abhaAddress,
  abhaNumber,
  abhaDetail,
}) => {
  const dispatch = useAppDispatch();
  const [steps, setSteps] = useState<ABDMStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfileValue = useCallback((fieldName: string) => {
    const normalized = normalizeERPKey(fieldName);
    return (
      abhaDetail.find(item => normalizeERPKey(item.field) === normalized)?.text ??
      ''
    ).trim();
  }, [abhaDetail]);

  const address =
    abhaAddress ||
    getProfileValue('preferredabhaaddress') ||
    getProfileValue('abhaaddress');
  const normalizedAbhaNumber =
    (abhaNumber || getProfileValue('abhanumber')).replace(/\D/g, '');
  const patientReferences = [
    String(patientId ?? '').trim(),
    getProfileValue('patientabhaid'),
  ];

  const loadStatus = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const [linkResult, consentResult] = await Promise.allSettled([
        dispatch(getERPListDataThunk({
          page: 'Linkcarecontextrequest',
          fromDate: '',
          toDate: '',
          param: '',
          branch: '',
        })).unwrap(),
        dispatch(getERPListDataThunk({
          page: 'ConsentRequest',
          fromDate: '',
          toDate: '',
          param: '',
          branch: '',
        })).unwrap(),
      ]);
      const failures: string[] = [];
      const getRows = (
        result: PromiseSettledResult<unknown>,
        pageLabel: string,
      ) => {
        if (result.status === 'rejected') {
          failures.push(getErrorMessage(result.reason));
          return [];
        }
        try {
          return parseERPListRows(result.value, pageLabel);
        } catch (parseError) {
          failures.push(getErrorMessage(parseError));
          return [];
        }
      };
      const identifiers = {
        address,
        abhaNumber: normalizedAbhaNumber,
        patientReferences,
      };
      const linkRows = dedupeRequests(
        getRows(linkResult, 'care context').filter(row =>
          matchesERPPatient(row, identifiers),
        ),
        ['completedat', 'updatedat', 'linkedat', 'createdat'],
      );
      const consentRows = dedupeRequests(
        getRows(consentResult, 'consent').filter(row =>
          matchesERPPatient(row, identifiers),
        ),
        ['decisionat', 'crcreatedat', 'createdat'],
      );

      const linkSteps = linkRows.map((row, index): ABDMStep => {
        const statusValue =
          getERPField(row, ['status']) || getERPField(row, ['linkstatus']);
        const status = getLinkStepStatus(statusValue);
        const requestId = String(
          getERPField(row, ['requestid']) || `link-${index + 1}`,
        );
        const dateValue =
          getERPField(row, ['completedat']) ||
          getERPField(row, ['updatedat']) ||
          getERPField(row, ['linkedat']) ||
          getERPField(row, ['createdat']);
        const description = String(
          getERPField(row, ['errormessage']) ||
          getERPField(row, ['linkstatus']) ||
          (status === 'success'
            ? 'ABDM confirmed the care-context link.'
            : status === 'failed'
              ? 'ABDM could not complete the care-context link.'
              : 'Waiting for ABDM to confirm the care-context link.'),
        );
        const displayStatus =
          status === 'success' ? 'Linked' : status === 'failed' ? 'Failed' : 'Requested';

        return {
          id: `care-${requestId}`,
          title: `Care Context ${displayStatus}`,
          description,
          date: formatDate(dateValue),
          status,
          icon: 'care',
          timestamp: getTimestamp(dateValue),
          referenceId: requestId,
        };
      });

      const consentSteps = consentRows.map((row, index): ABDMStep => {
        const statusValue = getERPField(row, ['status']);
        const status = getConsentStepStatus(statusValue);
        const requestId = String(
          getERPField(row, ['consentrequestid']) ||
          getERPField(row, ['requestid']) ||
          `consent-${index + 1}`,
        );
        const dateValue =
          getERPField(row, ['decisionat']) ||
          getERPField(row, ['crcreatedat']) ||
          getERPField(row, ['createdat']);
        const purpose = String(getERPField(row, ['purposetext']) ?? '').trim();
        const description = String(
          getERPField(row, ['errormessage']) ||
          (status === 'success'
            ? `Consent was approved${purpose ? ` for ${purpose}` : ''}.`
            : status === 'failed'
              ? `Consent request ${normalizeStatus(statusValue).toLowerCase()}${purpose ? ` for ${purpose}` : ''}.`
              : `Waiting for the patient to respond to the consent request.${purpose ? ` Purpose: ${purpose}` : ''}`),
        );
        const displayStatus =
          status === 'success'
            ? 'Approved'
            : status === 'failed'
              ? normalizeStatus(statusValue) || 'Failed'
              : 'Pending';

        return {
          id: `consent-${requestId}`,
          title: `Consent Request ${displayStatus}`,
          description,
          date: formatDate(dateValue),
          status,
          icon: 'consent',
          timestamp: getTimestamp(dateValue),
          referenceId: requestId,
        };
      });

      setSteps(
        [...linkSteps, ...consentSteps].sort(
          (left, right) => left.timestamp - right.timestamp,
        ),
      );
      if (failures.length > 0) {
        const message = failures.join(' ');
        setError(message);
        showToast('error', 'ABDM Status Partially Loaded', message);
      }
    } catch (loadError) {
      const message = getErrorMessage(loadError);
      setError(message);
      showToast('error', 'ABDM Status Failed', message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [
    address,
    dispatch,
    normalizedAbhaNumber,
    patientReferences.join('|'),
  ]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const overallStatus = useMemo<StepStatus | 'empty'>(() => {
    if (steps.length === 0) {
      return 'empty';
    }
    if (steps.some(step => step.status === 'failed')) {
      return 'failed';
    }
    if (steps.some(step => step.status === 'pending')) {
      return 'pending';
    }
    return 'success';
  }, [steps]);

  const lastStep = steps[steps.length - 1];
  const displayPatientName =
    patientName ||
    [
      getProfileValue('firstname'),
      getProfileValue('middlename'),
      getProfileValue('lastname'),
    ].filter(Boolean).join(' ') ||
    'Patient';
  const displayStatus =
    overallStatus === 'success'
      ? 'Success'
      : overallStatus === 'pending'
        ? 'Pending'
        : overallStatus === 'failed'
          ? 'Failed'
          : 'No Activity';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.patientInfoRow}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientAvatarText}>
              {displayPatientName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{displayPatientName}</Text>
            <Text style={styles.patientMeta}>
              {[patientId, address].filter(Boolean).join(' • ') || 'ABHA patient'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.syncedCard,
            overallStatus === 'pending' && styles.syncedCardPending,
            overallStatus === 'failed' && styles.syncedCardFailed,
            overallStatus === 'empty' && styles.syncedCardEmpty,
          ]}
        >
          <View
            style={[
              styles.syncedIcon,
              overallStatus === 'pending' && styles.syncedIconPending,
              overallStatus === 'failed' && styles.syncedIconFailed,
              overallStatus === 'empty' && styles.syncedIconEmpty,
            ]}
          >
            <Text style={styles.syncedCheck}>
              {overallStatus === 'success'
                ? '✓'
                : overallStatus === 'failed'
                  ? '!'
                  : overallStatus === 'pending'
                    ? '…'
                    : '–'}
            </Text>
          </View>
          <View style={styles.syncedContent}>
            <Text
              style={[
                styles.syncedTitle,
                overallStatus === 'pending' && styles.syncedTitlePending,
                overallStatus === 'failed' && styles.syncedTitleFailed,
                overallStatus === 'empty' && styles.syncedTitleEmpty,
              ]}
            >
              {overallStatus === 'success'
                ? 'ABDM Activity Synced'
                : overallStatus === 'pending'
                  ? 'ABDM Requests In Progress'
                  : overallStatus === 'failed'
                    ? 'ABDM Activity Needs Attention'
                    : 'No ABDM Activity Yet'}
            </Text>
            <Text style={styles.syncedDescription}>
              {overallStatus === 'empty'
                ? 'Care-context link and consent request statuses will appear here.'
                : `${steps.filter(step => step.status === 'success').length} completed, ${steps.filter(step => step.status === 'pending').length} pending, ${steps.filter(step => step.status === 'failed').length} failed`}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isLoading || refreshing}
          onPress={() => void loadStatus(true)}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>
            {refreshing ? 'Refreshing…' : 'Refresh status'}
          </Text>
        </Pressable>

        {isLoading ? (
          <ActivityIndicator style={styles.loading} />
        ) : error && steps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              onPress={() => void loadStatus()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : steps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No care-context link or consent request records were found for this patient.
            </Text>
          </View>
        ) : (
          <>
            {error ? (
              <Text style={styles.partialError}>
                Some status records could not be loaded: {error}
              </Text>
            ) : null}
            <View style={styles.timeline}>
              {steps.map((step, index) => (
                <TimelineItem
                  key={step.id}
                  step={step}
                  isLast={index === steps.length - 1}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.currentStatusCard}>
          <View style={styles.currentStatusHeader}>
            <Text style={styles.currentStatusTitle}>
              Current Status
            </Text>
            <View
              style={[
                styles.successBadge,
                overallStatus === 'pending' && styles.pendingBadge,
                overallStatus === 'failed' && styles.failedBadge,
                overallStatus === 'empty' && styles.emptyBadge,
              ]}
            >
              <View
                style={[
                  styles.successBadgeDot,
                  overallStatus === 'pending' && styles.pendingBadgeDot,
                  overallStatus === 'failed' && styles.failedBadgeDot,
                  overallStatus === 'empty' && styles.emptyBadgeDot,
                ]}
              />
              <Text
                style={[
                  styles.successBadgeText,
                  overallStatus === 'pending' && styles.pendingBadgeText,
                  overallStatus === 'failed' && styles.failedBadgeText,
                  overallStatus === 'empty' && styles.emptyBadgeText,
                ]}
              >
                {displayStatus}
              </Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              Latest Activity
            </Text>
            <Text style={styles.statusValue}>
              {lastStep?.date ?? '-'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              Latest Request ID
            </Text>
            <View style={styles.referenceContainer}>
              <Text
                style={styles.referenceValue}
                numberOfLines={1}
              >
                {lastStep?.referenceId ?? '-'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/* =====================================================
   TIMELINE ITEM
===================================================== */

const TimelineItem = ({
  step,
  isLast,
}: {
  step: ABDMStep;
  isLast: boolean;
}) => {
  const isSuccess =
    step.status === 'success';

  const isPending =
    step.status === 'pending';

  const isFailed =
    step.status === 'failed';

  return (
    <View style={styles.timelineItem}>

      {/* -----------------------------------------------
          LEFT PROGRESS
      ----------------------------------------------- */}

      <View style={styles.progressColumn}>

        {/* Green check */}

        <View
          style={[
            styles.progressCheck,

            isSuccess &&
              styles.progressCheckSuccess,

            isPending &&
              styles.progressCheckPending,

            isFailed &&
              styles.progressCheckFailed,
          ]}
        >
          {isSuccess && (
            <Text style={styles.progressCheckText}>
              ✓
            </Text>
          )}

          {isPending && (
            <View style={styles.pendingDot} />
          )}

          {isFailed && (
            <Text style={styles.progressCheckText}>
              !
            </Text>
          )}
        </View>

        {/* Connector */}

        {!isLast && (
          <View
            style={[
              styles.progressLine,

              isSuccess &&
                styles.progressLineSuccess,
            ]}
          />
        )}

      </View>

      {/* -----------------------------------------------
          ICON
      ----------------------------------------------- */}

      <View
        style={[
          styles.stepIconContainer,

          isPending &&
            styles.stepIconPending,

          isFailed &&
            styles.stepIconFailed,
        ]}
      >
        <StepIcon
          type={step.icon}
          status={step.status}
        />
      </View>

      {/* -----------------------------------------------
          CONTENT
      ----------------------------------------------- */}

      <View
        style={[
          styles.stepContent,
          isLast && styles.lastStepContent,
        ]}
      >

        <Text
          style={[
            styles.stepTitle,

            isPending &&
              styles.pendingText,

            isFailed &&
              styles.failedText,
          ]}
        >
          {step.title}
        </Text>

        <Text style={styles.stepDescription}>
          {step.description}
        </Text>

        <Text style={styles.stepDate}>
          {step.date}
        </Text>

      </View>

    </View>
  );
};

/* =====================================================
   STEP ICON
===================================================== */

const StepIcon = ({
  type,
  status,
}: {
  type: ABDMStep['icon'];
  status: StepStatus;
}) => {
  if (status === 'pending') {
    return (
      <Text style={styles.pendingIcon}>
        …
      </Text>
    );
  }

  if (status === 'failed') {
    return (
      <Text style={styles.failedIcon}>
        !
      </Text>
    );
  }

  switch (type) {
    case 'care':
      return (
        <Text style={styles.iconText}>
          ◉
        </Text>
      );

    case 'consent':
      return (
        <Text style={styles.iconText}>
          ✓
        </Text>
      );

    default:
      return null;
  }
};

export default ABDMStatus;

const styles = StyleSheet.create({
  /* =====================================================
     MAIN
  ===================================================== */

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    height: 56,
    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },

  /* =====================================================
     ALL SYSTEMS SYNCED
  ===================================================== */

  syncedCard: {
    marginTop: 12,

    minHeight: 62,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderRadius: 10,

    backgroundColor: '#E8F8EF',

    flexDirection: 'row',
    alignItems: 'center',
  },

  syncedCardPending: {
    backgroundColor: '#FFFAEB',
  },

  syncedCardFailed: {
    backgroundColor: '#FEF3F2',
  },

  syncedCardEmpty: {
    backgroundColor: '#F2F4F7',
  },

  syncedIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: '#12B76A',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
  },

  syncedIconPending: {
    backgroundColor: '#F79009',
  },

  syncedIconFailed: {
    backgroundColor: '#D92D20',
  },

  syncedIconEmpty: {
    backgroundColor: '#98A2B3',
  },

  syncedCheck: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  syncedContent: {
    flex: 1,
  },

  syncedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#027A48',
  },

  syncedTitlePending: {
    color: '#B54708',
  },

  syncedTitleFailed: {
    color: '#B42318',
  },

  syncedTitleEmpty: {
    color: '#475467',
  },

  syncedDescription: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 19,
    color: '#667085',
  },

  /* =====================================================
     PATIENT INFO
  ===================================================== */

  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 14,
    marginBottom: 7,

    paddingHorizontal: 2,
  },

  patientAvatar: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#E6EFFD',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  patientAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1565C0',
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#344054',
  },

  patientMeta: {
    marginTop: 3,
    fontSize: 14,
    color: '#667085',
  },

  /* =====================================================
     TIMELINE
  ===================================================== */

  timeline: {
    marginTop: 15,
    paddingBottom: 5,
  },

  timelineItem: { 
    flexDirection: 'row',
    position: 'relative',
  },

  /* =====================================================
     LEFT PROGRESS
  ===================================================== */

  progressColumn: {
    width: 25,
    marginTop: 2,
    alignItems: 'center',
    position: 'relative',
  },

  progressCheck: {
    width: 18,
    height: 18,
    

    borderRadius: 9,

    backgroundColor: '#D0D5DD',

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 2,
  },

  progressCheckSuccess: {
    backgroundColor: '#12B76A',
  },

  progressCheckPending: {
    backgroundColor: '#F79009',
  },

  progressCheckFailed: {
    backgroundColor: '#D92D20',
  },

  progressCheckText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },

  pendingDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#FFFFFF',
  },

  progressLine: {
    position: 'absolute',

    top: 18,
    bottom: 0,

    width: 2,

    backgroundColor: '#D0D5DD',
  },

  progressLineSuccess: {
    backgroundColor: '#12B76A',
  },

  /* =====================================================
     STEP ICON
  ===================================================== */

  stepIconContainer: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: '#EEF4FF',

    borderWidth: 1,
    borderColor: '#BFD4F5',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 6,
    marginRight: 10,

    zIndex: 2,
  },

  stepIconPending: {
    backgroundColor: '#FFFAEB',
    borderColor: '#FEC84B',
  },

  stepIconFailed: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FDA29B',
  },

  iconText: {
    fontSize: 16,
    color: '#1565C0',
    fontWeight: '700',
  },

  pendingIcon: {
    fontSize: 18,
    color: '#B54708',
    fontWeight: '800',
  },

  failedIcon: {
    fontSize: 16,
    color: '#B42318',
    fontWeight: '800',
  },

  /* =====================================================
     STEP CONTENT
  ===================================================== */

  stepContent: {
    flex: 1,

    paddingTop: 1,
    paddingBottom: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },

  lastStepContent: {
    borderBottomWidth: 0,
  },

  stepTitle: {
    fontSize: 14,
    lineHeight: 19,

    fontWeight: '700',

    color: '#344054',
  },

  stepDescription: {
    marginTop: 2,

    fontSize: 14,
    lineHeight: 19,

    color: '#667085',
  },

  stepDate: {
    marginTop: 2,

    fontSize: 14,
    lineHeight: 19,

    color: '#98A2B3',
  },

  pendingText: {
    color: '#B54708',
  },

  failedText: {
    color: '#B42318',
  },

  /* =====================================================
     CURRENT STATUS
  ===================================================== */

  currentStatusCard: {
    marginTop: 7,

    paddingHorizontal: 12,
    paddingVertical: 11,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#EAECF0',
  },

  currentStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 9,
  },

  currentStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#344054',
  },

  /* =====================================================
     SUCCESS BADGE
  ===================================================== */

  successBadge: {
    minHeight: 28,

    paddingHorizontal: 9,

    borderRadius: 14,

    backgroundColor: '#ECFDF3',

    flexDirection: 'row',
    alignItems: 'center',
  },

  successBadgeDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#12B76A',

    marginRight: 5,
  },

  successBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#027A48',
  },

  pendingBadge: {
    backgroundColor: '#FFFAEB',
  },

  pendingBadgeDot: {
    backgroundColor: '#F79009',
  },

  pendingBadgeText: {
    color: '#B54708',
  },

  failedBadge: {
    backgroundColor: '#FEF3F2',
  },

  failedBadgeDot: {
    backgroundColor: '#D92D20',
  },

  failedBadgeText: {
    color: '#B42318',
  },

  emptyBadge: {
    backgroundColor: '#F2F4F7',
  },

  emptyBadgeDot: {
    backgroundColor: '#98A2B3',
  },

  emptyBadgeText: {
    color: '#475467',
  },

  /* =====================================================
     STATUS ROW
  ===================================================== */

  statusRow: {
    minHeight: 34,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },

  statusLabel: {
    fontSize: 14,
    color: '#667085',
  },

  statusValue: {
    flex: 1,

    marginLeft: 15,

    fontSize: 14,
    color: '#344054',

    textAlign: 'right',
  },

  /* =====================================================
     REFERENCE ID
  ===================================================== */

  referenceContainer: {
    flex: 1,

    marginLeft: 15,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  referenceValue: {
    maxWidth: 220,

    fontSize: 14,
    color: '#344054',

    textAlign: 'right',
  },

  copyButton: {
    width: 28,
    height: 28,

    marginLeft: 6,

    justifyContent: 'center',
    alignItems: 'center',
  },

  copyIcon: {
    fontSize: 16,
    color: '#1565C0',
  },

  /* =====================================================
     REFRESH BUTTON
  ===================================================== */

  refreshButton: {
    height: 46,

    marginTop: 10,

    borderRadius: 8,

    borderWidth: 1,

    borderColor: '#669FE8',

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshPressed: {
    backgroundColor: '#F0F6FF',
  },

  refreshDisabled: {
    opacity: 0.6,
  },

  refreshIcon: {
    fontSize: 18,
    color: '#1565C0',

    marginRight: 7,
  },

  refreshText: {
    fontSize: 14,

    fontWeight: '600',

    color: '#1565C0',
  },

  loading: {
    marginVertical: 28,
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  emptyText: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  partialError: {
    color: '#B54708',
    fontSize: 12,
    marginBottom: 10,
  },

  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  retryText: {
    color: '#1565C0',
    fontWeight: '700',
  },
});