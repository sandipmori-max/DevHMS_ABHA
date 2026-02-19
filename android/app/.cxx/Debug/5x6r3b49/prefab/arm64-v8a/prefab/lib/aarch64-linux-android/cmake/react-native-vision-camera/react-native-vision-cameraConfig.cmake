if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "D:/SandipMori/DevERP_Mobile_app_01/node_modules/react-native-vision-camera/android/build/intermediates/cxx/Debug/276u1v4v/obj/arm64-v8a/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/SandipMori/DevERP_Mobile_app_01/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

