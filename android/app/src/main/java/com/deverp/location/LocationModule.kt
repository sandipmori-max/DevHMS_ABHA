package com.deverp.location



import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import android.util.Log
import com.deverp.location.LocationService
import com.facebook.react.bridge.ReadableArray
import com.deverp.location.UserData
import java.lang.Exception
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import android.location.Location
import com.google.android.gms.location.*
import android.os.Build
import android.os.Handler
import android.os.Looper
class LocationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "LocationModule"
    }



    @ReactMethod
    fun startService() {
        val serviceIntent = Intent(reactContext, LocationService::class.java)
        Log.d(
            "LocationModule",
            "✅ startService called with intent = $serviceIntent"
        )
        ContextCompat.startForegroundService(reactContext, serviceIntent)
    }

    @ReactMethod
    fun setUserTokens(data: ReadableArray) {
        for (i in 0 until data.size()) {
            val item = data.getMap(i)  // Each element is a ReadableMap
            val token = item?.getString("token")
            val link = item?.getString("link")

            if (token != null && link != null) {
                val entry = UserData(token, link)

                // Avoid duplicates
                if (!LocationService.userDataList.contains(entry)) {
                    LocationService.userDataList.add(entry)
                }
            }
        }
        Log.d("LocationModule", "✅ Received token-link pairs: ${LocationService.userDataList}")
    }

    @ReactMethod
    fun stopService() {
        Log.d(
            "LocationModule",
            "❌ stopService called"
        )
        val serviceIntent = Intent(reactContext, LocationService::class.java)
        reactContext.stopService(serviceIntent)
    }
 
    @ReactMethod
    fun getCurrentLocation(
        promise: Promise
    ) {

        try {

            val fusedLocationClient =
                LocationServices
                    .getFusedLocationProviderClient(
                        reactApplicationContext
                    )

            // ----------------------------------
            // FIRST TRY LAST KNOWN LOCATION
            // ----------------------------------

            fusedLocationClient
                .lastLocation
                .addOnSuccessListener { location ->

                    if (location != null) {

                        val age =
                            System.currentTimeMillis() -
                            location.time

                        val accuracy =
                            location.accuracy

                        Log.d(
                            "GPS",
                            "CACHE accuracy=$accuracy age=$age"
                        )

                        // USE RECENT GOOD LOCATION
                        if (
                            age <= 15000 &&
                            accuracy <= 100
                        ) {

                            val map =
                                Arguments.createMap()

                            map.putDouble(
                                "latitude",
                                location.latitude
                            )

                            map.putDouble(
                                "longitude",
                                location.longitude
                            )

                            map.putDouble(
                                "accuracy",
                                accuracy.toDouble()
                            )

                            map.putDouble(
                                "timestamp",
                                location.time.toDouble()
                            )

                            promise.resolve(map)

                            return@addOnSuccessListener
                        }
                    }

                    // ----------------------------------
                    // ANDROID 10+
                    // ----------------------------------

                    if (
                        Build.VERSION.SDK_INT >=
                        Build.VERSION_CODES.Q
                    ) {

                        Log.d(
                            "GPS",
                            "Using getCurrentLocation()"
                        )

                        fusedLocationClient
                            .getCurrentLocation(
                                Priority.PRIORITY_HIGH_ACCURACY,
                                null
                            )
                            .addOnSuccessListener { freshLocation ->

                                if (freshLocation != null) {

                                    val map =
                                        Arguments.createMap()

                                    map.putDouble(
                                        "latitude",
                                        freshLocation.latitude
                                    )

                                    map.putDouble(
                                        "longitude",
                                        freshLocation.longitude
                                    )

                                    map.putDouble(
                                        "accuracy",
                                        freshLocation.accuracy.toDouble()
                                    )

                                    map.putDouble(
                                        "timestamp",
                                        freshLocation.time.toDouble()
                                    )

                                    promise.resolve(map)

                                } else {

                                    promise.reject(
                                        "NO_LOCATION",
                                        "Unable to fetch location"
                                    )
                                }
                            }
                            .addOnFailureListener { e ->

                                promise.reject(
                                    "ERROR",
                                    e.message
                                )
                            }

                    } else {

                        // ----------------------------------
                        // ANDROID 9 AND BELOW
                        // ----------------------------------

                        Log.d(
                            "GPS",
                            "Using requestLocationUpdates()"
                        )

                        val locationRequest =
                            LocationRequest.create().apply {

                                priority =
                                    Priority.PRIORITY_HIGH_ACCURACY

                                interval = 2000

                                fastestInterval = 1000

                                numUpdates = 1
                            }

                        var isResolved = false

                        lateinit var callback: LocationCallback

                        callback =
                            object : LocationCallback() {

                                override fun onLocationResult(
                                    result: LocationResult
                                ) {

                                    if (isResolved) return

                                    isResolved = true

                                    fusedLocationClient
                                        .removeLocationUpdates(
                                            callback
                                        )

                                    val freshLocation =
                                        result.lastLocation

                                    if (freshLocation != null) {

                                        val map =
                                            Arguments.createMap()

                                        map.putDouble(
                                            "latitude",
                                            freshLocation.latitude
                                        )

                                        map.putDouble(
                                            "longitude",
                                            freshLocation.longitude
                                        )

                                        map.putDouble(
                                            "accuracy",
                                            freshLocation.accuracy.toDouble()
                                        )

                                        map.putDouble(
                                            "timestamp",
                                            freshLocation.time.toDouble()
                                        )

                                        promise.resolve(map)

                                    } else {

                                        promise.reject(
                                            "NO_LOCATION",
                                            "Unable to fetch location"
                                        )
                                    }
                                }
                            }

                        // START LOCATION UPDATES

                        fusedLocationClient
                            .requestLocationUpdates(
                                locationRequest,
                                callback,
                                Looper.getMainLooper()
                            )

                        // TIMEOUT SAFETY

                        Handler(
                            Looper.getMainLooper()
                        ).postDelayed({

                            if (!isResolved) {

                                isResolved = true

                                fusedLocationClient
                                    .removeLocationUpdates(
                                        callback
                                    )

                                promise.reject(
                                    "TIMEOUT",
                                    "Location timeout"
                                )
                            }

                        }, 15000)
                    }
                }
                .addOnFailureListener { e ->

                    promise.reject(
                        "ERROR",
                        e.message
                    )
                }

        } catch (e: Exception) {

            promise.reject(
                "ERROR",
                e.message
            )
        }
    }
}
