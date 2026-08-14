import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type StepStatus = 'success' | 'pending' | 'failed';

interface ABDMStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: StepStatus;
  icon: 'patient' | 'abha' | 'encounter' | 'care' | 'link';
}

interface ABDMStatusProps {
  patientName?: string;
  patientId?: string;
  abhaAddress?: string;
  lastSync?: string;
  referenceId?: string;

  steps?: ABDMStep[];

  onRefresh?: () => Promise<void> | void;
  onCopyReference?: () => void;
}

/* =====================================================
   DEFAULT DATA
===================================================== */

const DEFAULT_STEPS: ABDMStep[] = [
  {
    id: 'patient',
    title: 'Patient Identified',
    description: 'Patient details verified',
    date: '14 Aug 2026, 10:21 AM',
    status: 'success',
    icon: 'patient',
  },

  {
    id: 'abha',
    title: 'ABHA Verified',
    description: 'ABHA details fetched from ABDM',
    date: '14 Aug 2026, 10:24 AM',
    status: 'success',
    icon: 'abha',
  },

  {
    id: 'encounter',
    title: 'Encounter Created',
    description: 'Visit/Encounter created',
    date: '14 Aug 2026, 10:28 AM',
    status: 'success',
    icon: 'encounter',
  },

  {
    id: 'care-context',
    title: 'Care Context Created',
    description: 'Care context created',
    date: '14 Aug 2026, 10:30 AM',
    status: 'success',
    icon: 'care',
  },

  {
    id: 'linked',
    title: 'Linked to ABDM',
    description: 'Care context linked successfully',
    date: '14 Aug 2026, 10:32 AM',
    status: 'success',
    icon: 'link',
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ABDMStatus: React.FC<ABDMStatusProps> = ({
  patientName = 'Rahul Shah',
  patientId = 'P10021',
  abhaAddress = 'rahul@abdm',
  lastSync = '14 Aug 2026, 10:32 AM',
  referenceId = 'abdm-cc-2026-001-8f3a2c',

  steps = DEFAULT_STEPS,

  onRefresh,
  onCopyReference,
}) => {
  const [refreshing, setRefreshing] =
    useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing) {
      return;
    }

    try {
      setRefreshing(true);

      await onRefresh?.();
    } catch (error) {
      console.log(
        'ABDM refresh error:',
        error,
      );
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, onRefresh]);

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

       

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* =================================================
            ALL SYSTEMS SYNCED
        ================================================= */}

        <View style={styles.syncedCard}>

          <View style={styles.syncedIcon}>
            <Text style={styles.syncedCheck}>
              ✓
            </Text>
          </View>

          <View style={styles.syncedContent}>
            <Text style={styles.syncedTitle}>
              All Systems Synced
            </Text>

            <Text style={styles.syncedDescription}>
              Patient record is successfully linked with ABDM
            </Text>
          </View>

        </View>
 

        <View style={styles.timeline}>

          {steps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              isLast={
                index === steps.length - 1
              }
            />
          ))}

        </View>


        <View style={styles.currentStatusCard}>

          <View style={styles.currentStatusHeader}>

            <Text style={styles.currentStatusTitle}>
              Current Status
            </Text>

            <View style={styles.successBadge}>

              <View style={styles.successBadgeDot} />

              <Text style={styles.successBadgeText}>
                Success
              </Text>

            </View>

          </View>

          {/* Last Sync */}

          <View style={styles.statusRow}>

            <Text style={styles.statusLabel}>
              Last Sync
            </Text>

            <Text style={styles.statusValue}>
              {lastSync}
            </Text>

          </View>

          {/* Reference ID */}

          <View style={styles.statusRow}>

            <Text style={styles.statusLabel}>
              Reference ID
            </Text>

            <View style={styles.referenceContainer}>

              <Text
                style={styles.referenceValue}
                numberOfLines={1}
              >
                {referenceId}
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
    case 'patient':
      return (
        <Text style={styles.iconText}>
          ♙
        </Text>
      );

    case 'abha':
      return (
        <Text style={styles.iconText}>
          ♙
        </Text>
      );

    case 'encounter':
      return (
        <Text style={styles.iconText}>
          □
        </Text>
      );

    case 'care':
      return (
        <Text style={styles.iconText}>
          ◉
        </Text>
      );

    case 'link':
      return (
        <Text style={styles.iconText}>
          ▣
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

  syncedIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: '#12B76A',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
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
});