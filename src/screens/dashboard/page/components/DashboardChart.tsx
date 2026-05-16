import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useMemo, useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import {
    BarChart,
    BubbleChart,
    LineChart,
    PieChart,
    PopulationPyramid,
} from "react-native-gifted-charts";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

type Props = {
    html: string;
    chartType: any;
    isForChart: any;
    accentColors: any
};




const DashboardChart = ({ html, isForChart, chartType, accentColors }: Props) => {

    console.log("accentColors----", accentColors)
    const COLORS = [
        "#4CAF50",
        "#2196F3",
        accentColors,
        "#9C27B0",
        "#F44336",
        "#009688",
    ];
    const parsedData = useMemo(() => {
        if (!html) return null;

        const rowMatches = [...html.matchAll(/<tr>(.*?)<\/tr>/g)];

        const rows = rowMatches.map((row) => {
            const cols = [...row[1].matchAll(/<td>(.*?)<\/td>/g)].map(
                (c) => c[1].trim()
            );

            return cols;
        });

        if (rows.length < 2) return null;

        return {
            headers: rows[0].slice(1),
            bodyRows: rows.slice(1),
        };
    }, [html]);

    if (!parsedData) return null;

    const { headers, bodyRows } = parsedData;

    const maxValue = Math.max(
        ...bodyRows.flatMap((row) =>
            row.slice(1).map((v) => Number(v) || 0)
        ),
        0
    );

    // ---------------- BAR DATA ----------------

    const barData = bodyRows.map((row) => ({
        label: row[0],
        stacks: headers.map((_, index) => ({
            value: Number(row[index + 1]) || 0,
            frontColor: COLORS[index % COLORS.length],
        })),
    }));

    // ---------------- LINE DATA ----------------

    const lineDataSets = headers.map((_, headerIndex) => ({
        data: bodyRows.map((row) => ({
            value: Number(row[headerIndex + 1]) || 0,
            label: row[0],
        })),
        color: COLORS[headerIndex % COLORS.length],
    }));

    // ---------------- PIE DATA ----------------

    const pieData = bodyRows.map((row, index) => ({
        value: Number(row[1]) || 0,
        text: row[0],
        color: COLORS[index % COLORS.length],
    }));

    // ---------------- PYRAMID DATA ----------------

    const pyramidData = bodyRows.map((row) => ({
        left: Number(row[1]) || 0,
        right: Number(row[2]) || 0,
        label: row[0],
    }));

    // ---------------- BUBBLE DATA ----------------

    const bubbleData = bodyRows.map((row, index) => ({
        value: Number(row[1]) || 0,
        label: row[0],
        color: COLORS[index % COLORS.length],
    }));

    const renderChart = () => {
        switch (chartType) {
            case "BarChart":
                return (
                    <View
                    >
                        <BarChart
                            stackData={barData}
                            barWidth={28}
                            spacing={28}
                            roundedTop
                            roundedBottom
                            noOfSections={5}
                            maxValue={maxValue}
                            isAnimated
                            height={120}
                            hideRules={false}
                            xAxisThickness={1}
                            yAxisThickness={1}
                            yAxisTextStyle={{
                                color: "#777",
                                fontSize: 11,
                            }}
                            xAxisLabelTextStyle={{
                                color: ERP_COLOR_CODE.ERP_APP_COLOR,
                                fontSize: 11,
                            }}
                            showGradient
                        />
                    </View>
                );

            case "LineChart":
                return (
                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <View style={{
                            width: "100%",

                        }}>
                            <LineChart
                                areaChart
                                curved
                                thickness={3}
                                startFillColor={COLORS[0]}
                                endFillColor={COLORS[0]}
                                startOpacity={0.25}
                                endOpacity={0.02}
                                data={lineDataSets[0]?.data || []}
                                data2={lineDataSets[1]?.data}
                                data3={lineDataSets[2]?.data}
                                data4={lineDataSets[3]?.data}
                                color1={lineDataSets[0]?.color}
                                color2={lineDataSets[1]?.color}
                                color3={lineDataSets[2]?.color}
                                color4={lineDataSets[3]?.color}
                                maxValue={maxValue}
                                spacing={110}
                                initialSpacing={10}
                                isAnimated
                                height={240}
                                hideRules={false}
                                yAxisThickness={1}
                                xAxisThickness={1}
                                dataPointsHeight={8}
                                dataPointsWidth={8}
                                dataPointsRadius={4}
                                textColor1="#000"
                                textShiftY={8}
                            />
                        </View>
                    </View>
                );

            case "PieChart":
                const totalValue = pieData.reduce(
                    (sum, item) => sum + item.value,
                    0
                );

                return (
                    <View
                        style={{
                            width: "100%",
                        }}
                    >
                        {/* Pie Chart */}
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <View style={{
                                width: "50%",
                                left: Platform.OS === 'android' ? -14 : -12
                            }}>
                                <PieChart
                                    data={pieData}
                                    donut
                                    radius={Platform.OS === 'android' ? 68 : 74}
                                    innerRadius={Platform.OS === 'android' ? 52 : 60}
                                    innerCircleColor="#FFF"
                                    focusOnPress
                                    strokeColor="#FFF"
                                    strokeWidth={2}
                                    showText={false}
                                    centerLabelComponent={() => (
                                        <>
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: 14,
                                                    color:
                                                        'black'
                                                }}
                                            >
                                                Total
                                            </Text>
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    color:
                                                        'black'
                                                }}
                                            >
                                                {totalValue}
                                            </Text>
                                        </>
                                    )}
                                />
                            </View>
                            <View
                                style={{
                                    width: "50%",
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {pieData.map((item, index) => {
                                    const percentage =
                                        totalValue > 0
                                            ? ((item.value / totalValue) * 100).toFixed(1)
                                            : "0";

                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "#F7F7F7",
                                                borderRadius: 4,
                                                padding: 8,
                                                marginVertical: 2
                                            }}
                                        >
                                            {/* Color Dot */}
                                            <View
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    borderRadius: 4,
                                                    backgroundColor: item.color,
                                                    marginRight: 12,
                                                }}
                                            />

                                            {/* Label */}
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "600",
                                                        color: "#000",
                                                    }}
                                                >
                                                    {item.text}
                                                </Text>

                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: "#777",
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {percentage}%
                                                </Text>
                                            </View>

                                            {/* Value */}
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: "700",
                                                    color: "#000",
                                                }}
                                            >
                                                {item.value}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Modern Legends */}

                    </View>
                );

            case "PopulationPyramid":
                return (
                    <View
                        style={{
                            left: -20,
                        }}
                    >
                        <PopulationPyramid
                            data={pyramidData}
                            height={260}
                            width={340}
                            leftBarColor={COLORS[0]}
                            rightBarColor={COLORS[1]}
                            leftBarBorderRadius={6}
                            rightBarBorderRadius={6}
                            showMidAxis
                            showValuesAsLabels
                            midAxisLabelWidth={70}
                            labelsDistanceFromYAxis={8}
                        />
                    </View>
                );

            case "BubbleChart":
                return (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <BubbleChart
                            data={bubbleData}
                            bubbleColors={COLORS}
                            showGradient
                            textColor="#000"
                            textSize={12}
                        />
                    </View>
                );

            default:
                return null;
        }
    };


    return (
        <>
            <View
                style={{
                    backgroundColor: "#FFF",
                    borderRadius: 16,
                    padding: 6,
                }}
            >
                {renderChart()}
            </View>
        </>
    );
};

export default DashboardChart;