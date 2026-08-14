import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type DocumentType =
  | 'Prescription'
  | 'Lab Report'
  | 'Discharge Summary'
  | 'Other';

type DocumentStatus =
  | 'Shared'
  | 'Pending'
  | 'Not Shared';

interface PatientDocument {
  id: string;

  title: string;

  type: DocumentType;

  fileName: string;

  fileSize: string;

  createdAt: string;

  visitId: string;

  careContextId?: string;

  doctor: string;

  department: string;

  status: DocumentStatus;
}

const DOCUMENTS: PatientDocument[] = [
  {
    id: '1',
    title: 'Prescription',
    type: 'Prescription',
    fileName: 'Prescription_14Aug2026.pdf',
    fileSize: '245 KB',
    createdAt: '14 Aug 2026, 10:30 AM',
    visitId: 'V1001',
    careContextId: 'CC-2026-001',
    doctor: 'Dr. Patel',
    department: 'Cardiology',
    status: 'Shared',
  },

  {
    id: '2',
    title: 'Blood Test Report',
    type: 'Lab Report',
    fileName: 'CBC_Report_14Aug2026.pdf',
    fileSize: '512 KB',
    createdAt: '14 Aug 2026, 12:15 PM',
    visitId: 'V1001',
    careContextId: 'CC-2026-001',
    doctor: 'Dr. Patel',
    department: 'Pathology',
    status: 'Pending',
  },

  {
    id: '3',
    title: 'Lipid Profile',
    type: 'Lab Report',
    fileName: 'Lipid_Profile_02Aug2026.pdf',
    fileSize: '380 KB',
    createdAt: '02 Aug 2026, 01:20 PM',
    visitId: 'V0987',
    careContextId: 'CC-2026-002',
    doctor: 'Dr. Sharma',
    department: 'Pathology',
    status: 'Shared',
  },

  {
    id: '4',
    title: 'Discharge Summary',
    type: 'Discharge Summary',
    fileName: 'Discharge_Summary_18Jun2026.pdf',
    fileSize: '1.2 MB',
    createdAt: '18 Jun 2026, 06:45 PM',
    visitId: 'V0765',
    careContextId: 'CC-2026-004',
    doctor: 'Dr. Rao',
    department: 'Emergency',
    status: 'Not Shared',
  },

  {
    id: '5',
    title: 'Consultation Notes',
    type: 'Other',
    fileName: 'Consultation_Notes_12Jul2026.pdf',
    fileSize: '190 KB',
    createdAt: '12 Jul 2026, 11:30 AM',
    visitId: 'V0876',
    careContextId: 'CC-2026-003',
    doctor: 'Dr. Mehta',
    department: 'ENT',
    status: 'Shared',
  },
];

/* ---------------------------------------------
   FILTER ARRAYS
--------------------------------------------- */

const DOCUMENT_TYPE_FILTERS = [
  {
    key: 'all',
    title: 'All',
  },
  {
    key: 'Prescription',
    title: 'Prescription',
  },
  {
    key: 'Lab Report',
    title: 'Lab Reports',
  },
  {
    key: 'Discharge Summary',
    title: 'Discharge',
  },
  {
    key: 'Other',
    title: 'Other',
  },
];

const DOCUMENT_STATUS_FILTERS = [
  {
    key: 'all',
    title: 'All',
  },
  {
    key: 'Shared',
    title: 'Shared',
  },
  {
    key: 'Pending',
    title: 'Pending',
  },
  {
    key: 'Not Shared',
    title: 'Not Shared',
  },
];

/* ---------------------------------------------
   PROPS
--------------------------------------------- */

interface DocumentsProps {
  onAddDocument?: () => void;

  onDocumentPress?: (
    document: PatientDocument,
  ) => void;

  onViewDocument?: (
    document: PatientDocument,
  ) => void;

  onShareDocument?: (
    document: PatientDocument,
  ) => void;
}

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */

const Documents: React.FC<DocumentsProps> = ({
  onAddDocument,
  onDocumentPress,
  onViewDocument,
  onShareDocument,
}) => {
  const [refreshing, setRefreshing] =
    useState(false);

  const [searchText, setSearchText] =
    useState('');

  const [selectedTypeFilter, setSelectedTypeFilter] =
    useState('all');

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState('all');

  /* ---------------------------------------------
     REFRESH
  --------------------------------------------- */

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  /* ---------------------------------------------
     FILTER DOCUMENTS
  --------------------------------------------- */

  const filteredDocuments = useMemo(() => {
    return DOCUMENTS.filter(document => {
      /* Type */

      const typeMatched =
        selectedTypeFilter === 'all' ||
        document.type === selectedTypeFilter;

      /* Status */

      const statusMatched =
        selectedStatusFilter === 'all' ||
        document.status === selectedStatusFilter;

      /* Search */

      const search =
        searchText.trim().toLowerCase();

      const searchMatched =
        !search ||
        document.title
          .toLowerCase()
          .includes(search) ||
        document.fileName
          .toLowerCase()
          .includes(search) ||
        document.visitId
          .toLowerCase()
          .includes(search) ||
        document.careContextId
          ?.toLowerCase()
          .includes(search) ||
        document.doctor
          .toLowerCase()
          .includes(search);

      return (
        typeMatched &&
        statusMatched &&
        searchMatched
      );
    });
  }, [
    searchText,
    selectedTypeFilter,
    selectedStatusFilter,
  ]);

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */

  return (
    <View style={styles.container}>

      {/* Header */}
 

      {/* Summary */}

      <DocumentSummary />

      {/* Search */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>
          ⌕
        </Text>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search documents..."
          placeholderTextColor="#98A2B3"
          style={styles.searchInput}
        />

        {searchText.length > 0 && (
          <Pressable
            onPress={() => setSearchText('')}
          >
            <Text style={styles.clearText}>
              ×
            </Text>
          </Pressable>
        )}
      </View>

      {/* Document Type Filter */}

      <Text style={styles.filterLabel}>
        Document Type
      </Text>

      <FlatList
        horizontal
        data={DOCUMENT_TYPE_FILTERS}
        keyExtractor={item => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.filterContent
        }
        renderItem={({ item }) => (
          <FilterChip
            title={item.title}
            active={
              selectedTypeFilter === item.key
            }
            onPress={() =>
              setSelectedTypeFilter(
                item.key,
              )
            }
          />
        )}
      />

      {/* Status Filter */}

      <Text style={styles.filterLabel}>
        ABDM Sharing Status
      </Text>

      <FlatList
        horizontal
        data={DOCUMENT_STATUS_FILTERS}
        keyExtractor={item => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.filterContent
        }
        renderItem={({ item }) => (
          <FilterChip
            title={item.title}
            active={
              selectedStatusFilter ===
              item.key
            }
            onPress={() =>
              setSelectedStatusFilter(
                item.key,
              )
            }
          />
        )}
      />

      {/* Result Count */}

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filteredDocuments.length} documents
          found
        </Text>
      </View>

      {/* List */}

      <FlatList
        data={filteredDocuments}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredDocuments.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() =>
              onDocumentPress?.(item)
            }
            onView={() =>
              onViewDocument?.(item)
            }
            onShare={() =>
              onShareDocument?.(item)
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            onAdd={onAddDocument}
          />
        }
      />
    </View>
  );
};

/* ---------------------------------------------
   SUMMARY
--------------------------------------------- */

const DocumentSummary = () => {
  const total = DOCUMENTS.length;

  const shared = DOCUMENTS.filter(
    item => item.status === 'Shared',
  ).length;

  const pending = DOCUMENTS.filter(
    item => item.status === 'Pending',
  ).length;

  return (
    <View style={styles.summaryContainer}>

      <SummaryItem
        value={total}
        label="Total"
      />

      <SummaryItem
        value={shared}
        label="Shared"
        type="success"
      />

      <SummaryItem
        value={pending}
        label="Pending"
        type="warning"
      />

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
  type?: 'success' | 'warning';
}) => {
  return (
    <View style={styles.summaryItem}>
      <Text
        style={[
          styles.summaryValue,
          type === 'success' &&
            styles.successSummary,
          type === 'warning' &&
            styles.warningSummary,
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

/* ---------------------------------------------
   DOCUMENT CARD
--------------------------------------------- */

interface DocumentCardProps {
  document: PatientDocument;

  onPress?: () => void;

  onView?: () => void;

  onShare?: () => void;
}

const DocumentCard: React.FC<
  DocumentCardProps
> = ({
  document,
  onPress,
  onView,
  onShare,
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
      {/* Header */}

      <View style={styles.cardHeader}>

        <View style={styles.documentLeft}>

          <DocumentIcon
            type={document.type}
          />

          <View style={styles.documentTitle}>
            <Text
              style={styles.documentName}
              numberOfLines={1}
            >
              {document.title}
            </Text>

            <Text
              style={styles.fileName}
              numberOfLines={1}
            >
              {document.fileName}
            </Text>
          </View>

        </View>

        <DocumentStatus
          status={document.status}
        />

      </View>

      {/* Details */}

      <View style={styles.detailsContainer}>

        <DetailRow
          icon="📄"
          label="Type"
          value={document.type}
        />

        <DetailRow
          icon="🪪"
          label="Visit"
          value={document.visitId}
        />

        <DetailRow
          icon="👨‍⚕️"
          label="Doctor"
          value={document.doctor}
        />

        <DetailRow
          icon="🏥"
          label="Department"
          value={document.department}
        />

        <DetailRow
          icon="🔗"
          label="Care Context"
          value={
            document.careContextId ||
            'Not Linked'
          }
        />

      </View>

      {/* File Info */}

      <View style={styles.fileInfoRow}>

        <View style={styles.fileInfoItem}>
          <Text style={styles.fileInfoLabel}>
            File Size
          </Text>

          <Text style={styles.fileInfoValue}>
            {document.fileSize}
          </Text>
        </View>

        <View style={styles.fileInfoItem}>
          <Text style={styles.fileInfoLabel}>
            Created
          </Text>

          <Text style={styles.fileInfoValue}>
            {document.createdAt}
          </Text>
        </View>

      </View>

      {/* Footer */}

      <View style={styles.footer}>

        <View style={styles.footerActions}>

          <Pressable
            onPress={event => {
              event.stopPropagation();
              onView?.();
            }}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>
              View
            </Text>
          </Pressable>

          {document.status !==
            'Shared' && (
            <Pressable
              onPress={event => {
                event.stopPropagation();
                onShare?.();
              }}
              style={styles.shareButton}
            >
              <Text style={styles.shareButtonText}>
                Share to ABDM
              </Text>
            </Pressable>
          )}

          {document.status ===
            'Shared' && (
            <View
              style={
                styles.sharedContainer
              }
            >
              <Text style={styles.sharedCheck}>
                ✓
              </Text>

              <Text style={styles.sharedText}>
                Shared with ABDM
              </Text>
            </View>
          )}

        </View>

        <Text style={styles.arrow}>
          ›
        </Text>

      </View>
    </Pressable>
  );
};

/* ---------------------------------------------
   DOCUMENT ICON
--------------------------------------------- */

const DocumentIcon = ({
  type,
}: {
  type: DocumentType;
}) => {
  let icon = '📄';

  if (type === 'Prescription') {
    icon = '💊';
  }

  if (type === 'Lab Report') {
    icon = '🧪';
  }

  if (type === 'Discharge Summary') {
    icon = '🏥';
  }

  return (
    <View style={styles.documentIcon}>
      <Text style={styles.documentIconText}>
        {icon}
      </Text>
    </View>
  );
};

/* ---------------------------------------------
   STATUS
--------------------------------------------- */

const DocumentStatus = ({
  status,
}: {
  status: DocumentStatus;
}) => {
  const config = {
    Shared: {
      background: '#ECFDF3',
      text: '#027A48',
      dot: '#12B76A',
    },

    Pending: {
      background: '#FFFAEB',
      text: '#B54708',
      dot: '#F79009',
    },

    'Not Shared': {
      background: '#F2F4F7',
      text: '#475467',
      dot: '#98A2B3',
    },
  };

  const current = config[status];

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor:
            current.background,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: current.dot,
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          {
            color: current.text,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

/* ---------------------------------------------
   DETAIL ROW
--------------------------------------------- */

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

/* ---------------------------------------------
   FILTER CHIP
--------------------------------------------- */

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
        active &&
          styles.activeFilterChip,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active &&
            styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

/* ---------------------------------------------
   EMPTY STATE
--------------------------------------------- */

const EmptyState = ({
  onAdd,
}: {
  onAdd?: () => void;
}) => {
  return (
    <View style={styles.empty}>

      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>
          📄
        </Text>
      </View>

      <Text style={styles.emptyTitle}>
        No Documents Found
      </Text>

      <Text style={styles.emptyDescription}>
        No documents match the selected
        filters or search criteria.
      </Text>

      <Pressable
        onPress={onAdd}
        style={styles.emptyButton}
      >
        <Text style={styles.emptyButtonText}>
          Add Document
        </Text>
      </Pressable>

    </View>
  );
};

export default Documents;

/* ---------------------------------------------
   STYLES
--------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },

  subtitle: {
    marginTop: 3, 
    color: '#667085',
  },

  addButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  addIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 4,
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  /* Summary */

  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingVertical: 11,
    marginBottom: 12,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAECF0',
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: 10,
    color: '#667085',
  },

  successSummary: {
    color: '#027A48',
  },

  warningSummary: {
    color: '#B54708',
  },

  /* Search */

  searchContainer: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 14,
  },

  searchIcon: {
    fontSize: 21,
    color: '#667085',
    marginRight: 7,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 12,
    color: '#101828',
  },

  clearText: {
    fontSize: 22,
    color: '#98A2B3',
  },

  /* Filters */

  filterLabel: {
    marginBottom: 7,
    fontSize: 11,
    fontWeight: '600',
    color: '#475467',
  },

  filterContent: {
    paddingBottom: 12,
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

  resultRow: {
    marginBottom: 9,
  },

  resultText: {
    fontSize: 10,
    color: '#98A2B3',
  },

  /* List */

  listContent: {
    paddingBottom: 24,
  },

  separator: {
    height: 10,
  },

  /* Card */

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

  documentLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },

  documentIcon: {
    width: 43,
    height: 43,
    borderRadius: 8,
    backgroundColor: '#EFF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  documentIconText: {
    fontSize: 20,
  },

  documentTitle: {
    flex: 1,
    justifyContent: 'center',
  },

  documentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },

  fileName: {
    marginTop: 4,
    fontSize: 10,
    color: '#667085',
  },

  statusBadge: {
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 4,
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
    fontSize: 10,
    fontWeight: '600',
  },

  /* Details */

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
    width: 82,
    color: '#98A2B3',
  },

  detailValue: {
    flex: 1,
    color: '#475467',
    fontWeight: '600',
  },

  /* File Info */

  fileInfoRow: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    flexDirection: 'row',
  },

  fileInfoItem: {
    flex: 1,
  },

  fileInfoLabel: {
    color: '#98A2B3',
  },

  fileInfoValue: {
    marginTop: 3,
    color: '#475467',
    fontWeight: '600',
  },

  /* Footer */

  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewButton: {
    height: 31,
    paddingHorizontal: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    marginRight: 7,
  },

  viewButtonText: {
    color: '#344054',
    fontWeight: '600',
  },

  shareButton: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 7,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
  },

  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  sharedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sharedCheck: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#ECFDF3',
    color: '#12B76A',
    textAlign: 'center',
    lineHeight: 19,
    fontWeight: '700',
    marginRight: 5,
  },

  sharedText: {
    color: '#027A48',
    fontWeight: '600',
  },

  arrow: {
    fontSize: 18,
    color: '#98A2B3',
    fontWeight: '300',
  },

  /* Empty */

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
    borderRadius: 32,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIconText: {
    fontSize: 20,
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