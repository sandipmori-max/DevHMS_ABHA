import Foundation
import CoreLocation

@objcMembers
class LocationService: NSObject, CLLocationManagerDelegate {

    static let shared = LocationService()

    private let manager = CLLocationManager()
    private var lastLocation: CLLocation?

    var userDataList: [(token: String, link: String)] = []

    override init() {
        super.init()
        print("🚀 [LocationService] INIT")

        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.allowsBackgroundLocationUpdates = true
        manager.pausesLocationUpdatesAutomatically = false

        print("⚙️ [LocationService] CLLocationManager configured")
    }

    func start() {
        print("▶️ [LocationService] start() called")

        let status = manager.authorizationStatus
        print("🔐 [LocationService] Authorization status BEFORE request: \(status.rawValue)")

        manager.requestAlwaysAuthorization()
        manager.startUpdatingLocation()

        print("📡 [LocationService] startUpdatingLocation() called")
    }

    func stop() {
        print("⏹️ [LocationService] stop() called")
        manager.stopUpdatingLocation()
        print("🛑 [LocationService] Location updates stopped")
    }

    // MARK: - Location Callbacks

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("📍 [LocationService] didUpdateLocations called")
        print("📍 [LocationService] Locations count: \(locations.count)")

        guard let location = locations.last else {
            print("❌ [LocationService] No location found")
            return
        }

        lastLocation = location

        print("""
        ✅ [LocationService] New Location:
        • Lat: \(location.coordinate.latitude)
        • Lng: \(location.coordinate.longitude)
        • Accuracy: \(location.horizontalAccuracy)m
        """)

        syncLocation(location)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("❌ [LocationService] Location error: \(error.localizedDescription)")
        sendDisabled()
    }

    // MARK: - Sync Logic

    private func syncLocation(_ location: CLLocation) {
        print("🔄 [LocationService] syncLocation() started")
        print("👥 [LocationService] userDataList count: \(userDataList.count)")

        if userDataList.isEmpty {
            print("⚠️ [LocationService] No users found, skipping API calls")
            return
        }

        for (index, user) in userDataList.enumerated() {
            print("➡️ [LocationService] Sending location for user \(index)")
            print("🔑 Token: \(user.token)")
            print("🌐 Link: \(user.link)")

            callAPI(
                token: user.token,
                link: user.link,
                location: "\(location.coordinate.latitude),\(location.coordinate.longitude)"
            )
        }
    }

    private func sendDisabled() {
        print("🚫 [LocationService] sendDisabled() called")
        print("👥 [LocationService] userDataList count: \(userDataList.count)")

        for (index, user) in userDataList.enumerated() {
            print("➡️ [LocationService] Sending DISABLED status for user \(index)")
            print("🔑 Token: \(user.token)")
            print("🌐 Link: \(user.link)")

            callAPI(
                token: user.token,
                link: user.link,
                location: "disabled"
            )
        }
    }

    // MARK: - API Call

    private func callAPI(token: String, link: String, location: String) {
        let urlString = "\(link)/msp_api.aspx/syncLocation"
        print("🌍 [LocationService] API URL: \(urlString)")
        print("📦 [LocationService] Payload: token=\(token), location=\(location)")

        guard let url = URL(string: urlString) else {
            print("❌ [LocationService] Invalid URL")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "token": token,
            "location": location
        ]

        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ [LocationService] API Error: \(error.localizedDescription)")
                return
            }

            if let httpResponse = response as? HTTPURLResponse {
                print("📬 [LocationService] API Response Code: \(httpResponse.statusCode)")
            }

            if let data = data,
               let responseString = String(data: data, encoding: .utf8) {
                print("📨 [LocationService] API Response Body: \(responseString)")
            }
        }.resume()
    }
}
