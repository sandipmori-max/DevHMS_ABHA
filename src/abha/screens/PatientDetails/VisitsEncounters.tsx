import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type VisitType = 'OPD' | 'IPD' | 'Emergency';

type VisitStatus =
    | 'Active'
    | 'Completed'
    | 'Cancelled';

interface Visit {
    id: string;
    visitId: string;
    type: VisitType;
    department: string;
    doctor: string;
    date: string;
    time: string;
    status: VisitStatus;
    careContextLinked: boolean;
    careContextId?: string;
}

interface VisitsEncountersProps {
    onVisitPress?: (visit: Visit) => void;
    onAddVisit?: () => void;
}

const VISITS: Visit[] = [
    {
        id: '1',
        visitId: 'V1001',
        type: 'OPD',
        department: 'Cardiology',
        doctor: 'Dr. Patel',
        date: '14 Aug 2026',
        time: '10:00 AM',
        status: 'Active',
        careContextLinked: true,
        careContextId: 'CC-2026-001',
    },
    {
        id: '2',
        visitId: 'V0987',
        type: 'OPD',
        department: 'General Medicine',
        doctor: 'Dr. Sharma',
        date: '02 Aug 2026',
        time: '11:30 AM',
        status: 'Completed',
        careContextLinked: true,
        careContextId: 'CC-2026-002',
    },
    {
        id: '3',
        visitId: 'V0876',
        type: 'OPD',
        department: 'ENT',
        doctor: 'Dr. Mehta',
        date: '12 Jul 2026',
        time: '10:15 AM',
        status: 'Completed',
        careContextLinked: true,
        careContextId: 'CC-2026-003',
    },
    {
        id: '4',
        visitId: 'V0765',
        type: 'Emergency',
        department: 'Emergency',
        doctor: 'Dr. Rao',
        date: '18 Jun 2026',
        time: '08:20 PM',
        status: 'Completed',
        careContextLinked: false,
    },
    {
        id: '5',
        visitId: 'V0654',
        type: 'IPD',
        department: 'Orthopedics',
        doctor: 'Dr. Shah',
        date: '05 Jun 2026',
        time: '09:00 AM',
        status: 'Completed',
        careContextLinked: false,
    },
];

const VisitsEncounters: React.FC<
    VisitsEncountersProps
> = ({
    onVisitPress,
    onAddVisit,
}) => {
        const [refreshing, setRefreshing] =
            useState(false);

        const handleRefresh = useCallback(() => {
            setRefreshing(true);

            setTimeout(() => {
                setRefreshing(false);
            }, 800);
        }, []);

        const renderVisit = ({
            item,
        }: {
            item: Visit;
        }) => {
            return (
                <VisitCard
                    visit={item}
                    onPress={() =>
                        onVisitPress?.(item)
                    }
                />
            );
        };

        const CARE_CONTEXT_FILTERS = [
            {
                key: 'all',
                title: 'All',
            },
            {
                key: 'opd',
                title: 'OPD',
            },
            {
                key: 'ipd',
                title: 'IPD',
            },
            {
                key: 'emergency',
                title: 'Emergency',
            },
        ];

        const [selectedFilter, setSelectedFilter] =
            useState('all');
        return (
            <View style={styles.container}>


                {/* Filters */}

                <View style={styles.filters}>
                    {CARE_CONTEXT_FILTERS.map(filter => (
                        <FilterChip
                            key={filter.key}
                            title={filter.title}
                            active={
                                selectedFilter === filter.key
                            }
                            onPress={() =>
                                setSelectedFilter(filter.key)
                            }
                        />
                    ))}
                </View>

                {/* List */}

                <FlatList
                    data={VISITS}
                    keyExtractor={item => item.id}
                    renderItem={renderVisit}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        VISITS.length === 0
                            ? styles.emptyContainer
                            : styles.listContent
                    }
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    ListEmptyComponent={
                        <EmptyState />
                    }
                />
            </View>
        );
    };

interface VisitCardProps {
    visit: Visit;
    onPress?: () => void;
}

const VisitCard: React.FC<
    VisitCardProps
> = ({
    visit,
    onPress,
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
                {/* Top Row */}

                <View style={styles.cardTopRow}>
                    <View style={styles.visitLeft}>
                        <VisitIcon type={visit.type} />

                        <View style={styles.visitHeading}>
                            <View style={styles.visitIdRow}>
                                <Text style={styles.visitId}>
                                    {visit.visitId}
                                </Text>

                                <VisitTypeBadge
                                    type={visit.type}
                                />
                            </View>

                            <Text style={styles.department}>
                                {visit.department}
                            </Text>
                        </View>
                    </View>

                    <StatusBadge
                        status={visit.status}
                    />
                </View>

                {/* Details */}

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>
                            📅
                        </Text>

                        <Text style={styles.detailText}>
                            {visit.date} • {visit.time}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>
                            👨‍⚕️
                        </Text>

                        <Text style={styles.detailText}>
                            {visit.doctor}
                        </Text>
                    </View>
                </View>

                {/* Care Context */}

                <View style={styles.bottomRow}>
                    {visit.careContextLinked ? (
                        <View style={styles.linkedContainer}>
                            <View style={styles.successDot}>
                                <Text style={styles.check}>
                                    ✓
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.linkedText}>
                                    Care Context Linked
                                </Text>

                                {visit.careContextId && (
                                    <Text
                                        style={
                                            styles.careContextId
                                        }
                                    >
                                        {visit.careContextId}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pendingContainer}>
                            <View style={styles.pendingDot}>
                                <Text style={styles.pendingIcon}>
                                    !
                                </Text>
                            </View>

                            <Text style={styles.pendingText}>
                                Care Context Not Linked
                            </Text>
                        </View>
                    )}

                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </View>
            </Pressable>
        );
    };

const VisitIcon = ({
    type,
}: {
    type: VisitType;
}) => {
    const getIcon = () => {
        switch (type) {
            case 'OPD':
                return '⚕';

            case 'IPD':
                return '⌂';

            case 'Emergency':
                return '✚';

            default:
                return '•';
        }
    };

    return (
        <View
            style={[
                styles.visitIcon,
                type === 'Emergency' &&
                styles.emergencyIcon,
                type === 'IPD' &&
                styles.ipdIcon,
            ]}
        >
            <Text style={styles.visitIconText}>
                {getIcon()}
            </Text>
        </View>
    );
};

const VisitTypeBadge = ({
    type,
}: {
    type: VisitType;
}) => {
    return (
        <View
            style={[
                styles.typeBadge,
                type === 'Emergency' &&
                styles.emergencyBadge,
                type === 'IPD' &&
                styles.ipdBadge,
            ]}
        >
            <Text
                style={[
                    styles.typeBadgeText,
                    type === 'Emergency' &&
                    styles.emergencyBadgeText,
                    type === 'IPD' &&
                    styles.ipdBadgeText,
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
    status: VisitStatus;
}) => {
    const isActive = status === 'Active';

    return (
        <View
            style={[
                styles.statusBadge,
                isActive
                    ? styles.activeStatus
                    : styles.completedStatus,
            ]}
        >
            <View
                style={[
                    styles.statusDot,
                    isActive
                        ? styles.activeDot
                        : styles.completedDot,
                ]}
            />

            <Text
                style={[
                    styles.statusText,
                    isActive
                        ? styles.activeStatusText
                        : styles.completedStatusText,
                ]}
            >
                {status}
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

const EmptyState = () => {
    return (
        <View style={styles.empty}>
            <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>
                    +
                </Text>
            </View>

            <Text style={styles.emptyTitle}>
                No Visits Found
            </Text>

            <Text style={styles.emptyText}>
                There are no visits or encounters
                available for this patient.
            </Text>
        </View>
    );
};

export default VisitsEncounters;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
       
    },

    title: {
        fontSize: 16,
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
        borderRadius: 2,
        backgroundColor: '#1565C0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    addIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        lineHeight: 20,
        marginRight: 4,
        fontWeight: '400',
    },

    addText: {
        color: '#FFFFFF', 
        fontWeight: '600',
    },

    filters: {
        flexDirection: 'row',
        margin: 8,
    },

    filterChip: {
        paddingHorizontal: 14,
        height: 28,
        borderRadius: 4,
        backgroundColor: '#F2F4F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        marginVertical: 4,
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
        padding: 14,
        borderWidth: 1,
        borderColor: '#E4E7EC',
        marginHorizontal: 12
    },

    cardPressed: {
        opacity: 0.85,
    },

    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    visitLeft: {
        flexDirection: 'row',
        flex: 1,
    },

    visitIcon: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#E8F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 11,
    },

    ipdIcon: {
        backgroundColor: '#EEF4FF',
    },

    emergencyIcon: {
        backgroundColor: '#FFF0F0',
    },

    visitIconText: {
        color: '#1565C0',
        fontSize: 20,
        fontWeight: '700',
    },

    visitHeading: {
        flex: 1,
        paddingTop: 1,
    },

    visitIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    visitId: { 
        fontWeight: '700',
        color: '#101828',
        marginRight: 7,
    },

    department: {
        marginTop: 4, 
        fontSize: 12,
        fontWeight: '500',
        color: '#475467',
    },

    typeBadge: {
        paddingHorizontal: 7,
        height: 21,
        borderRadius: 6,
        backgroundColor: '#E8F1FF',
        justifyContent: 'center',
    },

    typeBadgeText: { 
        fontWeight: '700',
        color: '#1565C0',
         fontSize: 10
    },

    ipdBadge: {
        backgroundColor: '#EEF4FF',
    },

    ipdBadgeText: {
        color: '#344054',
    },

    emergencyBadge: {
        backgroundColor: '#FFF0F0',
    },

    emergencyBadgeText: {
        color: '#D92D20',
    },

    statusBadge: {
        height: 26,
        paddingHorizontal: 9,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },

    activeStatus: {
        backgroundColor: '#ECFDF3',
    },

    completedStatus: {
        backgroundColor: '#F2F4F7',
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },

    activeDot: {
        backgroundColor: '#12B76A',
    },

    completedDot: {
        backgroundColor: '#98A2B3',
    },

    statusText: { 
        fontWeight: '600',
        fontSize: 10
    },

    activeStatusText: {
        color: '#027A48',
    },

    completedStatusText: {
        color: '#475467',
    },

    details: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F2F4F7',
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
    },

    detailIcon: {
        width: 24, 
    },

    detailText: { 
        color: '#475467',
        fontWeight: '500',
    },

    bottomRow: {
        marginTop: 5,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F2F4F7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    linkedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    successDot: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#ECFDF3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    check: {
        color: '#12B76A', 
        fontWeight: '700',
    },

    linkedText: { 
        color: '#027A48',
        fontWeight: '600',
    },

    careContextId: {
        marginTop: 2, 
         fontSize: 12,
        color: '#98A2B3',
    },

    pendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    pendingDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFAEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    pendingIcon: {
        color: '#F79009', 
        fontWeight: '700',
    },

    pendingText: { 
        color: '#B54708',
        fontWeight: '600',
    },

    arrow: {
        fontSize: 25,
        color: '#98A2B3',
        fontWeight: '300',
    },

    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    empty: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    emptyIcon: {
        width: 60,
        height: 60,
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
        marginTop: 15,
        fontSize: 16,
        fontWeight: '700',
        color: '#101828',
    },

    emptyText: {
        marginTop: 6, 
        lineHeight: 19,
        textAlign: 'center',
        color: '#667085',
    },
});