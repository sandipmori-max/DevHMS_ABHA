import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    LayoutChangeEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';

export type PatientTabKey =
    | 'overview'
    | 'visits'
    | 'careContexts'
    | 'documents'
    | 'abha'
    | 'abdmStatus';

interface PatientTopTabsProps {
    activeTab: PatientTabKey;
    onTabChange: (tab: PatientTabKey) => void;
}

const TABS = [
    {
        key: 'overview' as const,
        title: 'Overview',
    },
    {
        key: 'visits' as const,
        title: 'Visits / Encounters',
    },
    {
        key: 'careContexts' as const,
        title: 'Care Contexts',
    },
    {
        key: 'documents' as const,
        title: 'Documents',
    }, 
    {
        key: 'abdmStatus' as const,
        title: 'ABDM Status',
    },
];

const PRIMARY_COLOR = '#1565C0';

const PatientTopTabs: React.FC<PatientTopTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const scrollRef = useRef<ScrollView>(null);

    /**
     * ONLY position is animated.
     *
     * useNativeDriver: true
     * is used only for translateX.
     */
    const indicatorX = useRef(
        new Animated.Value(0),
    ).current;

    /**
     * Width is NOT animated.
     * Normal React state avoids native/JS driver conflict.
     */
    const [indicatorWidth, setIndicatorWidth] =
        useState(0);

    const [tabLayouts, setTabLayouts] = useState<
        Record<
            PatientTabKey,
            {
                x: number;
                width: number;
            }
        >
    >({} as any);

    const [containerWidth, setContainerWidth] =
        useState(0);

    /**
     * Move indicator
     */
    const moveIndicator = (
        tabKey: PatientTabKey,
        animated = true,
    ) => {
        const layout = tabLayouts[tabKey];

        if (!layout) {
            return;
        }

        // Width is normal JS state
        setIndicatorWidth(layout.width);

        if (animated) {
            Animated.spring(indicatorX, {
                toValue: layout.x,
                useNativeDriver: true,
                damping: 18,
                stiffness: 180,
                mass: 0.7,
            }).start();
        } else {
            /**
             * setValue is safe here because this node is
             * ONLY used with native-driver animation.
             */
            indicatorX.setValue(layout.x);
        }

        /**
         * Keep active tab visible
         */
        if (containerWidth > 0) {
            const tabCenter =
                layout.x + layout.width / 2;

            const targetScrollX = Math.max(
                0,
                tabCenter - containerWidth / 2,
            );

            scrollRef.current?.scrollTo({
                x: targetScrollX,
                animated: true,
            });
        }
    };

    /**
     * When tab layouts are available
     */
    useEffect(() => {
        const layout = tabLayouts[activeTab];

        if (!layout) {
            return;
        }

        setIndicatorWidth(layout.width);

        /**
         * Initial position.
         * No animation required here.
         */
        indicatorX.setValue(layout.x);
    }, [tabLayouts]);

    /**
     * Handle individual tab layout
     */
    const handleTabLayout = (
        tabKey: PatientTabKey,
        event: LayoutChangeEvent,
    ) => {
        const { x, width } = event.nativeEvent.layout;

        setTabLayouts(previous => ({
            ...previous,
            [tabKey]: {
                x,
                width,
            },
        }));
    };

    /**
     * Tab press
     */
    const handleTabPress = (
        tabKey: PatientTabKey,
    ) => {
        onTabChange(tabKey);

        requestAnimationFrame(() => {
            moveIndicator(tabKey, true);
        });
    };

    return (
        <View style={[styles.wrapper, ]}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.content}
                onLayout={event => {
                    setContainerWidth(
                        event.nativeEvent.layout.width,
                    );
                }}
            >
                {TABS.map(tab => {
                    const isActive =
                        activeTab === tab.key;

                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() =>
                                handleTabPress(tab.key)
                            }
                            onLayout={event =>
                                handleTabLayout(
                                    tab.key,
                                    event,
                                )
                            }
                            style={styles.tab}
                            android_ripple={{
                                color: '#E8F1FB',
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.tabText,
                                    isActive &&
                                    styles.activeTabText,
                                ]}
                            >
                                {tab.title}
                            </Text>
                            {
                                isActive &&
                                <View style={{
                                    top : 12,
                                    bottom: 0,
                                    width: 100,
                                    height: 4,
                                    borderRadius: 3,
                                    backgroundColor: PRIMARY_COLOR,
                                }}>

                                </View>
                            }

                        </Pressable>
                    );
                })}

                {/* Animated Indicator */}


            </ScrollView>

        </View>
    );
};

export default PatientTopTabs;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFFFFF',
    },

    content: {
        paddingHorizontal: 16,
        position: 'relative',
    },

    tab: {
        height: 50,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tabText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        color: '#667085',
    },

    activeTabText: {
        color: PRIMARY_COLOR,

        fontWeight: '700',
    },

    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        borderRadius: 3,
        backgroundColor: PRIMARY_COLOR,
    },

    bottomBorder: {
        height: 1,
        backgroundColor: '#E4E7EC',
    },
});