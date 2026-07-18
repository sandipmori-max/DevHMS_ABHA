if(NOT TARGET react-native-worklets-core::rnworklets)
add_library(react-native-worklets-core::rnworklets SHARED IMPORTED)
set_target_properties(react-native-worklets-core::rnworklets PROPERTIES
    IMPORTED_LOCATION "/Users/deverp/Desktop/Sandip_Mori/DevHMS/node_modules/react-native-worklets-core/android/build/intermediates/cxx/RelWithDebInfo/3b223c62/obj/x86_64/librnworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/deverp/Desktop/Sandip_Mori/DevHMS/node_modules/react-native-worklets-core/android/build/headers/rnworklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

