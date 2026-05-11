import Foundation
import CoreLocation
import React
@objc(LocationModule)
class LocationModule: NSObject {

    @objc
    func startService() {
        print("📍 [LocationModule] startService() CALLED from JS")
        LocationService.shared.start()
        print("✅ [LocationModule] LocationService.start() executed")
    }

    @objc
    func stopService() {
        print("🛑 [LocationModule] stopService() CALLED from JS")
        LocationService.shared.stop()
        print("✅ [LocationModule] LocationService.stop() executed")
    }

    @objc
    func setUserTokens(_ data: [[String: String]]) {
        print("📦 [LocationModule] setUserTokens() CALLED")
        print("📦 [LocationModule] Raw data from JS: \(data)")

        LocationService.shared.userDataList.removeAll()
        print("🧹 [LocationModule] Cleared existing userDataList")

        for (index, item) in data.enumerated() {
            let token = item["token"]
            let link = item["link"]

            if let token = token, let link = link {
                LocationService.shared.userDataList.append((token, link))
                print("✅ [LocationModule] Added token-link pair: \(token) | \(link)")
            } else {
                print("❌ [LocationModule] Invalid token/link at index \(index)")
            }
        }

        print("📊 [LocationModule] Final userDataList count: \(LocationService.shared.userDataList.count)")
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
func getCurrentLocation(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {

    let manager = CLLocationManager()

    // ⚡ STEP 1: Try last known location (FAST)
    if let location = manager.location {
        let age = Date().timeIntervalSince1970 - location.timestamp.timeIntervalSince1970

        // 🎯 1 min fresh check
        if age < 60 {
            resolve([
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude,
                "accuracy": location.horizontalAccuracy,
                "timestamp": location.timestamp.timeIntervalSince1970 * 1000
            ])
            return
        }
    }

    // 🔁 STEP 2: Fresh fetch (single shot)
    let tempManager = CLLocationManager()
    tempManager.desiredAccuracy = kCLLocationAccuracyHundredMeters

    class TempDelegate: NSObject, CLLocationManagerDelegate {
        var resolve: RCTPromiseResolveBlock
        var reject: RCTPromiseRejectBlock

        init(resolve: @escaping RCTPromiseResolveBlock,
             reject: @escaping RCTPromiseRejectBlock) {
            self.resolve = resolve
            self.reject = reject
        }

        func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
            guard let loc = locations.last else {
                reject("NO_LOCATION", "No location found", nil)
                return
            }

            resolve([
                "latitude": loc.coordinate.latitude,
                "longitude": loc.coordinate.longitude,
                "accuracy": loc.horizontalAccuracy,
                "timestamp": loc.timestamp.timeIntervalSince1970 * 1000
            ])

            manager.stopUpdatingLocation()
        }

        func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
            reject("ERROR", error.localizedDescription, error)
        }
    }

    let delegate = TempDelegate(resolve: resolve, reject: reject)
    tempManager.delegate = delegate

    // retain delegate (important ⚠️)
    objc_setAssociatedObject(tempManager, "delegate", delegate, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)

    tempManager.requestWhenInUseAuthorization()
    tempManager.startUpdatingLocation()
}
}
