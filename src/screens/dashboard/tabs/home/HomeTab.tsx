import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { styles } from './home_style';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import FullViewLoader from '../../../../components/loader/FullViewLoader';
import NoData from '../../../../components/no_data/NoData';
import ERPIcon from '../../../../components/icon/ERPIcon';
import { getERPDashboardThunk } from '../../../../store/slices/auth/thunk';
import ErrorMessage from '../../../../components/error/Error';
import { DARK_COLOR, ERP_COLOR_CODE } from '../../../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Footer from './Footer';
import PieChartSection from './chartData';
import TaskListScreen from '../../../task_module/task_list/TaskListScreen';
import TaskDetailsBottomSheet from '../../../task_module/task_details/TaskDetailsScreen';
import { formatDateForAPI, parseCustomDate } from '../../../../utils/helpers';
 import DateTimePicker from '@react-native-community/datetimepicker';

 const { width } = Dimensions.get('screen');

const hasHtmlContent = (str: string) => {
  if (!str || typeof str !== 'string') return false;
  return /<([a-z]+)([^>]*?)>/i.test(str);
};

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { dashboard, isDashboardLoading, isAuthenticated, error, user } = useAppSelector(
    state => state.auth,
  );
  console.log('🚀 ~ HomeScreen ~ dashboard:', dashboard);
  const [loadingPageId, setLoadingPageId] = useState<any>(null);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
 const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const DUMMY_LIST = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5',
];

  const [showDatePicker, setShowDatePicker] = useState<null | {
      type: 'from' | 'to';
      show: boolean;
    }>(null);

    const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;


  const theme = useAppSelector(state => state?.theme.mode);
  console.log("theme", theme)
  const [actionLoader, setActionLoader] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredDashboard, setFilteredDashboard] = useState(dashboard);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const translateX = useRef(new Animated.Value(width)).current;

  const htmlItems = filteredDashboard.filter(item => hasHtmlContent(item.data));
  const emptyItems = filteredDashboard.filter(item => item?.data === '');

  const textItems = filteredDashboard.filter(item => item.data && !hasHtmlContent(item.data));

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      const filtered = dashboard.filter(item =>
        (item.name || '').toLowerCase().includes(searchText.toLowerCase()),
      );
      console.log('🚀 ~ HomeScreen ~ filtered-------:', filtered);
      setFilteredDashboard(filtered);
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchText, dashboard]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -350,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
    headerStyle: {
      backgroundColor: theme === 'dark' ? 'black' : ERP_COLOR_CODE.ERP_APP_COLOR,   // <-- BLACK HEADER
    },
    headerTintColor: '#fff',  
      headerTitle: () =>
        showSearch ? (
          <View style={{ width: width - 70, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search dashboard here..."
              style={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                paddingHorizontal: 12,
                height: 36,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowSearch(false);
                setSearchText('');
              }}
            >
              <MaterialIcons
                name="clear"
                size={24}
                color={ERP_COLOR_CODE.ERP_WHITE}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            Home
          </Text>
        ),
      headerRight: () => (
        <>
          {!showSearch && (
            <>
              {dashboard.length > 5 && (
                <ERPIcon name="search" onPress={() => setShowSearch(true)} />
              )}
              
              <ERPIcon
                name="refresh"
                onPress={() => {
                  setActionLoader(true);
                  setIsRefresh(!isRefresh);
                  dispatch(getERPDashboardThunk());
                  setTimeout(() => {
                    setActionLoader(false);
                  }, 100);
                }}
                isLoading={actionLoader}
              />
              <ERPIcon
                name={!isHorizontal ? 'list' : 'apps'}
                onPress={() => setIsHorizontal(prev => !prev)}
              />
              <ERPIcon
                name={'filter-alt'}
                onPress={() => setIsFilterVisible(prev => !prev)}
              />
            </>
          )}
        </>
      ),
      headerLeft: () => (
        <ERPIcon extSize={24} isMenu={true} name="menu" onPress={() => navigation?.openDrawer()} />
      ),
    });
  }, [navigation, isHorizontal, isRefresh, showSearch, dashboard, searchText, filteredDashboard, isFilterVisible]);

  useFocusEffect(
    useCallback(() => {
      setLoadingPageId(true);

      if (isAuthenticated) {
        dispatch(getERPDashboardThunk());
      }

      return () => {};
    }, [isAuthenticated, dispatch]),
  );
 const dummyUpcomingEvents = [];

  const dummyUpcomingBirthdays = [
    { id: 'b1', name: 'Amit Sharma', date: '28 sep 2025', type: 'Up-coming-Birthday' },
  ];

  const dummyUpcomingAnniversaries = [
    { id: 'w1', name: 'Rohit & Neha', date: '03 sep 2025', type: 'Up-coming-work-anniversary' },
  ];

  const todayEvents = [{ id: 't2', date: 'Today', title: 'UX Review', type: 'Event' }];
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const todayBirthdays = [];

  const todayAnniversaries = [];

  const dummyTasks = [
    {
      id: '1',
      title: 'Fix login bug',
      description: 'Check the API response and fix login issue',
      assignedTo: 'jr1',
      createdBy: 'senior1',
      status: 'pending',
      updatedAt: '2025-09-10T10:00:00Z',
    },
  ];
  const getInitials = (text?: string) => {
    if (!text) return '?';
    const trimmed = text?.trim();
    if (trimmed?.length === 0) return '?';
    return trimmed.slice(0, 2).toUpperCase();
  };

  const accentColors = ['#4C6FFF', '#00C2A8', '#FFB020', '#FF6B6B', '#9B59B6', '#20C997'];

  const pieChartData = filteredDashboard
    .filter(item => {
      const num = Number(item?.data);
      return item?.title !== 'Attendance Code' && item?.data !== '' && !isNaN(num) && num > 0;
    })
    .map((item, index) => ({
      value: Number(item?.data),
      color: accentColors[index % accentColors.length],
      text: item?.title,
    }));

     const openSheet = () => {
    setVisible(true);
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSelect = (item: string) => {
    if (selectedItem === item) {
      setSelectedItem(null); // deselect if tapped again
    } else {
      setSelectedItem(item);
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedItem;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.8}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // slide up
  });


  const renderDashboardItem = ({ item, index, isFromHtml, isFromMenu }: any) => {
     return (
      <TouchableOpacity
        key={item?.id || index}
        style={[
          styles.dashboardItem,
          {
            paddingLeft: 4,
            marginHorizontal: 4,
            borderRadius: 8,
            width: isFromHtml ? '100%' : isHorizontal ? '100%' : '48%',
            flex: 1,
            borderLeftColor: accentColors[index % accentColors.length],
            borderWidth: 1,
            borderLeftWidth: 3,
            backgroundColor:  theme === 'dark' ?  'black' : 'white'
            
          },
        ]}
        activeOpacity={0.7}
        onPress={async () => {
          if (item?.url.includes('.') || item?.url.includes('?') || item?.url.includes('/')) {
            navigation.navigate('Web', { item });
          } else {
            navigation.navigate('List', { item });
          }
        }}
      >
        <View
          style={{
            backgroundColor: theme === 'dark' ? 'black' : ERP_COLOR_CODE.ERP_WHITE,
            borderRadius: 8,
          }}
        >
          <View style={styles.dashboardItemContent}>
            <View style={styles.dashboardItemHeader}>
              <View style={styles.dashboardItemTopRow}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: accentColors[index % accentColors.length] },
                  ]}
                >
                  <MaterialIcons name={item?.image || 'widgets'} color={
                    'white'
                    } size={22} />
                  {/* <Text style={styles.iconText}>{getInitials(item?.name)}</Text> */}
                </View>
                <View style={styles.headerTextWrap}>
                  <Text
                    style={[
                      styles.dashboardItemText,
                      {
                        color:
                          theme === 'dark' ? 'white' : ERP_COLOR_CODE.ERP_BLACK,
                        flexShrink: 1,
                        includeFontPadding: false,
                        textAlignVertical: 'top',
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {isFromMenu
                      ? item?.title
                      : !isHorizontal
                      ? item?.title.replace(' ', '\n')
                      : item?.title}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: item.data ? 4 : 0 }}>
              {loadingPageId === (item.id || String(index)) && (
                <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={ERP_COLOR_CODE.ERP_007AFF} />
                  <Text style={{ marginLeft: 8, color: ERP_COLOR_CODE.ERP_6C757D }}>
                    Loading page...
                  </Text>
                </View>
              )}
              {item.data ? (
                <View style={styles.dataContainer}>
                  <Footer
                    textColor={accentColors[index % accentColors.length]}
                    isFromMenu={isFromMenu}
                    isHorizontal={isHorizontal}
                    footer={item?.data}
                    index={index}
                    accentColors={accentColors}
                     isFromListPage={undefined}                  />
                </View>
              ) : (
                <View style={styles.dataContainer}>
                  <Text style={styles.dashboardItemData} numberOfLines={2}>
                    {'-'}
                  </Text>
                </View>
              )}
            </View>
            {item?.footer ? (
              <View style={{ marginTop: 4 }}>
                <Footer
                  textColor={accentColors[index % accentColors.length]}
                  isFromMenu={isFromMenu}
                  isHorizontal={isHorizontal}
                  footer={item?.footer}
                  index={index}
                  accentColors={accentColors}
                   isFromListPage={undefined}                />
              </View>
            ) : (
              <Text
                style={{
                  color: accentColors[index % accentColors.length],
                }}
              >
                {'-'}
              </Text>
            )}
            {item?.footer || item.data ? (
              <> </>
            ) : (
              <View style={{ height: 12, width: 12, backgroundColor: '' }}></View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
 
  const scrollY = useRef(new Animated.Value(0)).current;
   const getCurrentMonthRange = useCallback(() => {
     const now = new Date();
     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
     const lastDay = new Date();
     const fromDateStr = formatDateForAPI(firstDay);
     const toDateStr = formatDateForAPI(lastDay);
     setFromDate(fromDateStr);
     setToDate(toDateStr);
     return { fromDate: fromDateStr, toDate: toDateStr };
   }, []);

   useEffect(() => {
      const { fromDate: initialFromDate, toDate: initialToDate } = getCurrentMonthRange();
      
    }, [getCurrentMonthRange]);

 useFocusEffect(
    useCallback(() => {
      const { fromDate: initialFromDate, toDate: initialToDate } = getCurrentMonthRange();
      // fetchListData(initialFromDate, initialToDate);
      return () => {};
    }, [getCurrentMonthRange,]),
  );

 const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'dismissed' || !selectedDate) {
      setShowDatePicker(null);
      return;
    }
    const { type } = showDatePicker!;
    const formattedDate = formatDateForAPI(selectedDate);

    if (type === 'to') {
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (fromDate) {
        const fromDateObj = new Date(fromDate.split('-').reverse().join('-'));
        if (selectedDate < fromDateObj) {
          Alert.alert('Invalid Date Range', 'To date cannot be before From date.', [
            { text: 'OK' },
          ]);
          setShowDatePicker(null);
          return;
        }
      }
      setToDate(formattedDate);
    } else {
      setFromDate(formattedDate);
      if (toDate) {
        const toDateObj = new Date(toDate.split('-').reverse().join('-'));
        if (selectedDate > toDateObj) {
          setToDate('');
        }
      }
    }
    setShowDatePicker(null);
  };


 function SmallItem({ left, primary, secondary, type }) {
    return (
      <TouchableOpacity style={[styles.itemRow,  theme === 'dark' && {
        backgroundColor: 'black'
      }]} activeOpacity={0.8}>
        <View style={[styles.avatar, {
          borderWidth: 1,
          borderColor: 'white'
        }]}>{left}</View>
        <View style={styles.itemText}>
          <Text numberOfLines={1} style={[styles.itemPrimary, theme === 'dark' && {
        color: 'white'
      }]}>
            {primary}
          </Text>
          <Text style={[styles.itemType,  theme === 'dark' && {
        color: 'white'
      }]}>{type}</Text>
        </View>
        <View>
          <Text style={[styles.itemSecondary,  theme === 'dark' && {
        color: 'white'
      }]}>{secondary}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View 
    style={{
      backgroundColor: isDashboardLoading ? 'black' : theme === 'dark' ?  'black' : 'white'
    }}
    >
      <View
        style={{
          marginTop: 1,
          backgroundColor:  theme === 'dark' ? 'black': ERP_COLOR_CODE.ERP_APP_COLOR,
          padding: 12,
          // width: width,
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          borderWidth: 1,
          borderColor:'white'
        }}
      >
        <Animated.View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            gap: 8,
            flexDirection: 'row',
            // transform: [{ translateX }],
          }}
        >
          <MaterialIcons name="business" size={24} color={"#FFF"} />
          <Text
            numberOfLines={1}
            style={{
              color: "#FFF",
              fontWeight: '600',
              fontSize: 16,
              maxWidth: 280,
            }}
          >
            {user?.companyName || ''}
          </Text>

        </Animated.View>

         {
      isFilterVisible && 
      <View style={{paddingHorizontal: 0, paddingVertical: 12}}>
       <View style={styles.dateContainer}>
                    {/* Start Date */}
                    <View style={styles.dateRow}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker({ type: 'from', show: true })}
                        style={styles.dateButton}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialIcons
                            name="calendar-today"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.dateButtonText,  {
                            color: '#FFF'
                          }]}>{fromDate || 'Select From Date'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: 1, width: 8 }}> </View>
      
                    <View style={styles.dateRow}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker({ type: 'to', show: true })}
                        style={styles.dateButton}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialIcons
                            name="calendar-today"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.dateButtonText,  {
                            color: '#FFF'
                          }]}>{toDate || 'Select To Date'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>


      <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 4}}>
      <TouchableOpacity style={styles.openButton} onPress={openSheet}>
        
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialIcons
                            name="apartment"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.dateButtonText,  {
                            color: '#FFF'
                          }]}>Branch</Text>
                        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.openButton} onPress={openSheet}>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialIcons
                            name="type-specimen-outlined"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.dateButtonText, {
                            color: '#FFF'
                          }]}>Type</Text>
                        </View>
      </TouchableOpacity>
      </View>
        {showDatePicker?.show && (
            <DateTimePicker
              value={
                showDatePicker?.type === 'from' && fromDate
                  ? parseCustomDate(fromDate)
                  : showDatePicker?.type === 'to' && toDate
                  ? parseCustomDate(toDate)
                  : new Date()
              }
              mode="date"
              onChange={handleDateChange}
              minimumDate={
                showDatePicker?.type === 'to' && fromDate
                  ? parseCustomDate(fromDate)
                  : new Date(new Date().getFullYear(), 0, 1)
              }
              maximumDate={
                showDatePicker?.type === 'from' && toDate ? parseCustomDate(toDate) : new Date()
              }
            />
          )}
      </View>
      
    }
      </View>

   

      {isDashboardLoading ? (
         <View
          style={{
            height: Dimensions.get('screen').height * 0.75,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? 'black' : 'white' ,
          }}
        >
        <FullViewLoader />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? 'black' : 'white' ,
          }}
        >
          <ErrorMessage message={error} />{' '}
        </View>
      ) : filteredDashboard?.length === 0 && !isDashboardLoading ? (
         <View
          style={{
            height: Dimensions.get('screen').height * 0.75,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? 'black' : 'white' ,
          }}
        >
        <NoData />

          </View>
      ) : (
        <>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            data={['']}
            keyExtractor={(_, i) => i.toString()}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
            })}
            scrollEventThrottle={16}
            renderItem={() => (
              <>
                {/* Pie chart section */}
                {pieChartData.length > 0 && (
                  <PieChartSection pieChartData={pieChartData} navigation={navigation} t={t} />
                )}
                {pieChartData.length === 0 && <View style={{ marginTop: 12 }} />}
                {/* Dashboard items */}
                <View style={styles.dashboardSection}>
                  <FlatList
                    key={`${isHorizontal}`}
                    keyboardShouldPersistTaps="handled"
                    data={[...textItems, ...emptyItems]}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={isHorizontal ? 1 : 2}
                    columnWrapperStyle={!isHorizontal ? styles.columnWrapper : undefined}
                    renderItem={
                      ({ item, index }) =>
                        renderDashboardItem({ item, index, isFromHtml: false, isFromMenu: false }) // 👈 custom prop passed here
                    }
                    showsVerticalScrollIndicator={false}
                  />
                </View>

                <View style={styles.dashboardSection}>
                  <FlatList
                    key={`${isHorizontal}`}
                    keyboardShouldPersistTaps="handled"
                    data={htmlItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={
                      ({ item, index }) =>
                        renderDashboardItem({ item, index, isFromHtml: true, isFromMenu: true }) // 👈 custom prop passed here
                    }
                    showsVerticalScrollIndicator={false}
                  />
                </View>
               
                <>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            data={['']}
            keyExtractor={(_, i) => i.toString()}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
            })}
            scrollEventThrottle={16}
            renderItem={() => (
              <>
                 
                <View style={[styles.grid,
                   
                ]}>
                  <View style={[styles.card, {

            backgroundColor:  theme === 'dark' ?  'black' : 'white'

                  }]}>
                    <View style={{ flexDirection: 'row', marginVertical: 8, gap: 6 }}>
                      <MaterialIcons
                        size={18}
                          color={theme === 'dark' ? 'white' : 'black'}
                        name="emoji-events"
                      />
                      <Text style={[styles.cardTitle,{
                          color: theme === 'dark' ? 'white' : 'black'
                      }]}>Events</Text>
                    </View>
                    <FlatList
                      data={todayEvents}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={[styles.avatarText, {
                            color: 'white'
                          }]}>T</Text>}
                          primary={item.title}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      key={`${isHorizontal}`}
                      data={dummyUpcomingEvents}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={[styles.avatarText, {
                            color: 'white'
                          }]}>E</Text>}
                          primary={item.title}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                  </View>

                  <View style={[styles.card,{
            backgroundColor:  theme === 'dark' ?  'black' : 'white'

                  }]}>
                    <View style={{ flexDirection: 'row', marginVertical: 8, gap: 6 }}>
                      <MaterialIcons
                        size={18}
                          color={theme === 'dark' ? 'white' : 'black'}
                        name="celebration"
                      />
                      <Text style={[styles.cardTitle,

                        {
                          color : theme === 'dark' ? 'white' : 'black'
                        }
                      ]}>Birthday & Work-anniversary</Text>
                    </View>
                    <FlatList
                      data={todayBirthdays}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={
                            <Text style={[styles.avatarText, {
                            color: 'white'
                          }]}>
                              {item.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')}
                            </Text>
                          }
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      data={dummyUpcomingBirthdays}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={
                            <Text style={[styles.avatarText, {
                            color: 'white'
                          }]}>
                              {item.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')}
                            </Text>
                          }
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                    <FlatList
                      data={todayAnniversaries}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={[styles.avatarText, {
                            color: 'white'
                          }]}>A</Text>}
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />

                    <FlatList
                      data={dummyUpcomingAnniversaries}
                      keyExtractor={i => i.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <SmallItem
                          left={<Text style={[styles.avatarText, {
                            color: 'white',
                          }]}>W</Text>}
                          primary={item.name}
                          secondary={item.date}
                          type={item?.type}
                        />
                      )}
                    />
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 12,
                      marginVertical: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <MaterialIcons
                        size={18}
                        color={ERP_COLOR_CODE.ERP_APP_COLOR}
                        name="pending-actions"
                      />
                      <Text style={{ fontSize: 16, fontWeight: '700' }}>My Pending Tasks</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Tasks', { isFromViewAll: true });
                      }}
                    >
                      <Text style={{ color: ERP_COLOR_CODE.ERP_BORDER_LINE, fontSize: 12 }}>
                        View all
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <TaskListScreen
                    tasks={dummyTasks}
                    onSelectTask={task => {
                      setSelectedTask(task);
                      setModalVisible(true);
                    }}
                    showPicker={undefined}
                    showFilter={undefined}
                  /> */}
                </View>

                {selectedTask && (
                  <TaskDetailsBottomSheet
                    visible={modalVisible}
                    task={selectedTask}
                    role="junior"
                    onClose={() => setModalVisible(false)}
                    onUpdate={updatedTask => {
                      setModalVisible(false);
                    }}
                  />
                )}
                <View style={{ height: 10, width: 100 }} />
              </>
            )}
          />
        </>
              </>
            )}
          />
        </>
      )}

       <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={closeSheet} />

        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY }] },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Select an Option</Text>
            <TouchableOpacity onPress={closeSheet}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={DUMMY_LIST}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </Animated.View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
 