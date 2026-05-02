// AppMapView.js

import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
const { width, height } = Dimensions.get("window");

// ------------------ LOCATION GENERATOR ------------------
const baseLat = 23.0225;
const baseLng = 72.5714;
const meterOffset = 0.000555;

const getNearbyLocation = (index) => {
  const offset = meterOffset * (index + 1);
  return {
    latitude: baseLat + offset,
    longitude: baseLng + offset,
  };
};

// ------------------ EMPLOYEE DATA ------------------
const employees = [
  {
    id: "1",
    name: "Sayma",
    status: "Active",
    ...getNearbyLocation(0),
    image: "https://i.pravatar.cc/150?img=32",
    route: [
      { latitude: 23.015, longitude: 72.545 },
      { latitude: 23.018, longitude: 72.553 },
      { latitude: 23.02, longitude: 72.562 },
      { latitude: 23.0225, longitude: 72.5714 },
    ],
  },
  {
    id: "2",
    name: "Akib Khan",
    status: "Active",
    ...getNearbyLocation(1),
    image: "https://i.pravatar.cc/150?img=12",
    route: [
      { latitude: 23.015, longitude: 72.545 },
      { latitude: 23.018, longitude: 72.553 },
      { latitude: 23.02, longitude: 72.562 },
      { latitude: 23.0225, longitude: 72.5714 },
    ],
  },
  {
    id: "3",
    name: "Jubair",
    status: "Offline",
    ...getNearbyLocation(2),
    image: "https://i.pravatar.cc/150?img=15",
    route: [
      { latitude: 23.015, longitude: 72.545 },
      { latitude: 23.018, longitude: 72.553 },
      { latitude: 23.02, longitude: 72.562 },
      { latitude: 23.0225, longitude: 72.5714 },
    ],
  },
  {
    id: "4",
    name: "Salman",
    status: "Active",
    ...getNearbyLocation(3),
    image: "https://i.pravatar.cc/150?img=45",
    route: [
      { latitude: 23.015, longitude: 72.545 },
      { latitude: 23.018, longitude: 72.553 },
      { latitude: 23.02, longitude: 72.562 },
      { latitude: 23.0225, longitude: 72.5714 },
    ],
  },
];

// ------------------ COMPONENT ------------------
const AppMapView = () => {
  const mapRef = useRef(null);
  const mapTypes = ["satellite", "standard", "hybrid", "terrain"];

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapType, setMapType] = useState("satellite");

  const changeMapType = () => {
    const currentIndex = mapTypes.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % mapTypes.length;
    setMapType(mapTypes[nextIndex]);
  };

  const fitRoute = (employee) => {
    if (!employee?.route?.length) return;

    mapRef.current?.fitToCoordinates(employee.route, {
      edgePadding: {
        top: 120,
        right: 80,
        bottom: isFullScreen ? 120 : 320,
        left: 80,
      },
      animated: true,
    });
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setTimeout(() => fitRoute(employee), 200);
  };

  useEffect(() => {
    if (selectedEmployee) {
      fitRoute(selectedEmployee);
    }
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const renderEmployeeItem = ({ item }) => {
    const isSelected = selectedEmployee?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.employeeItem, isSelected && {
            borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            borderWidth: 2,
            borderRadius: 8,
            padding : 10
        }]}
        onPress={() => handleEmployeeSelect(item)}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: item.status === "Active" ? "#32CD32" : "#999",
              },
            ]}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.employeeName,
            isSelected && styles.selectedEmployeeText,
          ]}
        >
          {item.name}
        </Text>

       </TouchableOpacity>
    );
  };

  const routePoints = selectedEmployee?.route || [];
  const startPoint = routePoints[0];
  const endPoint = routePoints[routePoints.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: baseLat,
          longitude: baseLng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* MARKERS */}
        {employees.map((employee) => (
          <Marker
            key={employee.id}
            coordinate={{
              latitude: employee.latitude,
              longitude: employee.longitude,
            }}
            onPress={() => handleEmployeeSelect(employee)}
            zIndex={selectedEmployee?.id === employee.id ? 999 : 1}
          >
            <Image
              source={{ uri: employee.image }}
              style={[
                styles.markerImage,
                selectedEmployee?.id === employee.id && styles.selectedMarker,
              ]}
            />
          </Marker>
        ))}

        {/* ROUTE */}
        {selectedEmployee && routePoints.length > 1 && (
          <Polyline
            coordinates={routePoints}
            strokeWidth={5}
            strokeColor="#ff4d6d"
          />
        )}

        {/* START */}
        {selectedEmployee && startPoint && (
          <Marker coordinate={startPoint}>
            <View style={styles.routeMarkerStart}>
              <Text style={styles.routeMarkerText}>S</Text>
            </View>
          </Marker>
        )}

        {/* END */}
        {selectedEmployee && endPoint && (
          <Marker coordinate={endPoint}>
            <View style={styles.routeMarkerEnd}>
              <Text style={styles.routeMarkerText}>E</Text>
            </View>
          </Marker>
        )}

        {/* CIRCLE */}
        {selectedEmployee && (
          <Circle
            center={{
              latitude: selectedEmployee.latitude,
              longitude: selectedEmployee.longitude,
            }}
            radius={50}
            strokeColor="rgba(255,77,109,0.45)"
            fillColor="rgba(255,77,109,0.15)"
          />
        )}
      </MapView>

      {/* CONTROLS */}
      <View style={styles.topRightControls}>
        <TouchableOpacity style={styles.fullScreenBtn} onPress={toggleFullScreen}>
          <MaterialIcons
            name={isFullScreen ? "fullscreen-exit" : "fullscreen"}
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapTypeBtn} onPress={changeMapType}>
          <MaterialIcons name="layers" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM CARD */}
      {!isFullScreen && (
        <View style={styles.bottomCard}>

            <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Employee list</Text>      
                <View style={{ height : 1, width: "100%", backgroundColor: "#eee", marginVertical: 8 }} />

            </View>

          {selectedEmployee && (
            <>
            <View style={styles.selectedHeader}>
              <Image
                source={{ uri: selectedEmployee.image }}
                style={styles.selectedAvatar}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.selectedName}>{selectedEmployee.name}</Text>

                <Text
                  style={[
                    styles.selectedStatus,
                    {
                      color:
                        selectedEmployee.status === "Active"
                          ? "#32CD32"
                          : "#999",
                    },
                  ]}
                >
                  {selectedEmployee.status}
                </Text>
              </View>
            </View>
            <View style={{ height : 1, width: "100%", backgroundColor: "#eee", marginBottom: 16 }} />
            </>
          )}
            

          <FlatList
            data={employees}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderEmployeeItem}
            showsHorizontalScrollIndicator={false}
            
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AppMapView;

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },

  topRightControls: {
    position: "absolute",
    top: 14,
    right: 8,
  },

  fullScreenBtn: {
    width: 34,
    height: 34,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
  },

  mapTypeBtn: {
    width: 34,
    height: 34,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  markerImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#fff",
  },

  selectedMarker: {
    borderColor: "#ff4d6d",
    borderWidth: 4,
    transform: [{ scale: 1.2 }],
  },

  routeMarkerStart: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  routeMarkerEnd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  routeMarkerText: { color: "#fff" },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  selectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  selectedName: { fontWeight: "bold", fontSize: 16 },
  selectedStatus: { fontSize: 13 },

  employeeItem: { marginRight: 15, alignItems: "center", padding : 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },

  employeeName: { fontSize: 12 },
  selectedEmployeeText: { fontWeight: "bold" },
  employeeSub: { fontSize: 10 },

  avatarWrapper: { position: "relative" },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
