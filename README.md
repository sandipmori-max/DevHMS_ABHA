// DevERP

// Multiple build creation with different Name + icon + package name

// --- android build ----
// ./gradlew --stop
// ./gradlew clean
// ./gradlew generateCodegenArtifactsFromSchema 
// cmd - gradlew assemble[BRAND_NAME]Release

// How to used - .env.clientA and .env.cientB ??

// How to run - clientA and clientB app ??
// gradlew installClientADebug -Pbrand=[BRAND_NAME]

Payroll Mobile App – API Documentation

d1ea2ea6-591c-4eba-9128-02b0e243614a
373b67afa904484cad3dd86e2c085176

d1ea2ea6-591c-4eba-9128-02b0e243614a
438acfebe5c442b4b5588be214318b93

value="61f573de0c2943368e83eb5784dfaa92"

//// sandip 
dev Infinix ZERO 20
app-id 7c76cc5c-33ce-4a33-8426-3ac583bf26d8
fir c-2bQQzIRf2t5q8YzHfXXQ:APA91bFwMLVKqV3pzj3G8PyB2NN9B43Qq4uuODozl798BwmL41diKj9OL5qj6K1IJgT4UlYnkQtFDN8qOg4986nBFdF9GloL01na7TL-hqFN9Obh80Hfxf4

token respo - fc6979ac5e0e4560a1a0b9425f46a09c 
new token - 6b30f59259594a519dcc20c66ea9b84b


1. Authentication Flow

Step 1: getLink
curl --location 'https://support.deverp.net/devws/appcode.aspx/getLink' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=hg4u3v1lqcd000cgwcp35vyx' \
--data '{
    "code": "payroll"
}'

[ step 2. setAppID: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/setAppID' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "user": "suresh",
    "pass": "suresh",
    "appid": "appid",
    "firebaseid" : "firebaseid",
    "device": "device"
}'

[ step 3. getAuth: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAuth' \
--header 'Content-Type: text/plain' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "appid":"",
    "device": ""
}'

[ step 4. getMenu: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getMenu' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 5. getDB: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDB' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 6. getPage ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getPage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst"
}'

[ step 7. getListData ----]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getListData' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst", "fd":"01-Apr-2024","td":"31-Aug-2025"
}'
//bc0d0d8843924c548c3b3d7c7b0f12ea

[ Attandanced - punch in]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhin",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"InDate\":\"\",\"InImage\":\"\",\"InRemarks\":\"\",\"InLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}'

[ Attandanced - punch out]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhout",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"OutDate\":\"\",\"OutImage\":\"\",\"OutRemarks\":\"\",\"OutLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}
'

[ get Drop-down ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDDL' \
--header 'Content-Type: application/json' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "dtlid":"1081",
     "where": "PropTypeName=~Gender~"
}'

[ get Ajax ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAjax' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=yuhpy41xwsqjq2olhay4i3c0' \
--data '{
     "token": "d78134973d9b4697a2b3d5b8b2e87510",
     "dtlid":"1072",
     "where":"Status=~A~",
     "search": "dadfdfdfdd"
 }'

[ save page ]
//iPhone 13 82BAA029-A1FA-42AC-AEF9-3FC2758EA9FA
//iPhone 13 82BAA029-A1FA-42AC-AEF9-3FC2758EA9FA
curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": 
"{\"EMPID\":\"1\",\"EMPCode\":\"00001\",\"CardNo\":\"\",\"BranchID\":\"1\",\"DepartmentID\":\"2\",\"DesignationID\":\"1\",\"JoinDate\":\"1/1/2025 12:00:00 AM\",\"Title\":\"Mr\",\"FirstName\":\"Satishvvbnnnnhn\",\"MiddleName\":\"Kalpeshbhai\",\"LastName\":\"Prajapati\",\"BirthDate\":\"1/1/1980 12:00:00 AM\",\"Gender\":\"M\",\"Religion\":\"Hindu\",\"BloodGroup\":\"AB-\",\"MobileNo\":\"87410256394\",\"MobileNo2\":\"\",\"PhoneNo\":\"9905012345\",\"EmailID\":\"satishk@gmail.com\",\"EmailID2\":\"satish@gmail.com\",\"EmergencyContactNo\":\"0533123456\",\"WebSite\":\"https://dev.com\",\"Disabilities\":\"51\",\"DisabilitiesRemarks\":\"\",\"LinkedIn\":\"satish.linkedin\",\"Facebook\":\"satish80\",\"Twitter\":\"satish1980\",\"Instagram\":\"satish80\",\"GitHub\":\"satishgit80\",\"CurrentAddress\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CurrentCityID\":\"48428\",\"CurrentDistrict\":\"AHMEDABAD\",\"CurrentState\":\"GUJARAT\",\"CurrentCountry\":\"INDIA\",\"CurrentPin\":\"380054\",\"Address\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CityID\":\"48428\",\"District\":\"AHMEDABAD\",\"State\":\"GUJARAT\",\"Country\":\"INDIA\",\"Pin\":\"380054\",\"AdharNo\":\"854172653987\",\"PANNo\":\"HGTUG5417H\",\"BankName\":\"HDFC Bank\",\"ACNo\":\"87456125367\",\"IFSCCode\":\"HDFC102310\",\"NameInBankAccount\":\"SATISH KALPESHBHAI PRAJAPATI\",\"PFNo\":\"PFSATISH\",\"ESINo\":\"ESICSATISH\",\"GratutityFormNo\":\"GT123456\",\"Status\":\"A\",\"ResignDate\":\"\",\"ResignReason\":\"\",\"Remarks\":\"\",\"LastDate\":\"\",\"UserID\":\"0\",\"CUID\":\"1\",\"Image\":\"d_logo.png\",\"CDT\":\"1/18/2025 12:00:00 AM\",\"MUID\":\"6\",\"MDT\":\"27-Aug-2025 13:22:37\"}",
 "page": "EmployeeMaster",
"token": "8c4aaf0e74fd4338943162b3876b2c7d"
}'


[ Delete ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDelete' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remark":"1=1",
     "page": "EmployeeMaster"
}'

[ Auth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ DeAuth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDeAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ Cancel ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageCancel' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'

[ getLastPunchIn ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getLastPunchIn' \
--header 'Content-Type: application/json' \
--data '{
    "token": "49d45d99eff64492b94f449238507c7c"
}'

[ syncLocation ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/syncLocation' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=ibj4tkc5ffzqbyp2xoni4pvt; ASP.NET_SessionId=2vj4yympr4l0kqag3xaxdcul' \
--data '{
    "token":"9eecfb8d7bbf4acba7568f21f078c9f5",
    "location":"45.5556,12.6655"
}'

     

1) Prerequisites (local)

Java JDK installed (openJDK 11+ recommended), Android SDK + platform tools, Android Studio or at least the Android build tools on PATH.

React Native CLI app (you said you already made a dummy app and not using Expo).

A Google account you’ll use to register as a Play developer.

(If you need help installing Android SDK / JDK I can paste commands — say the OS.)

2) Create a Google Play Developer account (one-time)

Sign up at the Play Console and pay the one-time registration fee (US$25 approx). You’ll also provide developer name and contact info. 
Google Support

Link: use Play Console signup when ready (Play Console help / Get started).

3) Prepare your app for release (source changes)

Bump versionName & versionCode in android/app/build.gradle (defaultConfig):

defaultConfig {
  applicationId "com.yourcompany.yourapp" // must be unique
  minSdkVersion rootProject.ext.minSdkVersion
  targetSdkVersion rootProject.ext.targetSdkVersion
  versionCode 1        // increment this for every upload
  versionName "1.0.0"  // visible to users
}


Always increment versionCode for every new upload. 
Android Developers

Unique applicationId / package name — Play requires each app’s package name be unique (you set this when you created the project). If you ever change it after publishing you’ll create a new app on Play.

Remove debug-only code/configs (dev servers, debug flags) and verify app works in release mode on device/emulator.

4) Create an upload key (keystore) — you control this

You need a keystore (upload key). Keep it and its passwords SAFE and back them up (Play cannot restore lost keystores easily).

Command (run in terminal):

# example — change alias/keystore name and passwords to your own values
keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


This will prompt for passwords and metadata. (Works on macOS / Linux / Windows with Java's keytool available.) 
React Native

Then move the generated my-upload-key.jks into your RN project android/app/ folder (or keep it safe elsewhere — but Gradle config below expects to find or reference it).

5) Configure Gradle so release builds are signed by your upload key

React Native docs recommend storing keystore properties in ~/.gradle/gradle.properties (or android/gradle.properties) and referencing them from android/app/build.gradle.

A. Add these to ~/.gradle/gradle.properties (or android/gradle.properties):

MYAPP_UPLOAD_STORE_FILE=my-upload-key.jks
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password_here


B. Add signing config to android/app/build.gradle (example snippet inside android { ... }):

signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        // Make sure you keep minify / proguard settings as desired
        signingConfig signingConfigs.release
        // minifyEnabled true/false depending on your needs
    }
}


This is the standard RN/Android way to point Gradle at your keystore. React Native docs explain this flow in detail. 
React Native

Important: for security, don’t check your *.jks or passwords into Git — add them to .gitignore and use secure storage/CI secrets.

6) Enroll in Play App Signing (Google Play signing)

For new apps, Play App Signing is mandatory: you upload an upload key (the one you created above) and Google will manage final app signing and distribution keys. Enroll when you create the app or during upload. 
Android Developers
Google Support

(Short version: you keep your upload key safe and upload the AAB signed with that upload key; Google manages the final signing key and distribution.)

7) Build the Android App Bundle (.aab)

Google Play requires/upload prefers AAB (Android App Bundle). From your RN project root:

# macOS / Linux
cd android
./gradlew bundleRelease

# Windows
cd android
gradlew.bat bundleRelease


When the build succeeds the AAB will be at:
android/app/build/outputs/bundle/release/app-release.aab — ready to upload to Play. 
React Native

8) Test the release build

Options:

Use Internal testing or Internal app sharing in Play Console (fastest way to get an installable link to testers). This avoids needing to produce APKs locally — upload the .aab to the internal track and invite testers. 
Google Play
Google Support

(Advanced) Use bundletool to generate device-specific APKs from the AAB and sideload — but internal testing is easier.

9) Create the app in Play Console & upload the AAB

Open Play Console → Create app → choose app name, language, app vs game, paid/free. (You picked up the dev account in step 2.) 
Google Support

Fill App Content (Policy) — privacy policy URL, data safety, target audience, content rating, ads declaration. These must be completed before publishing. 
Google Support
+1

Go to Release > Testing > Internal testing (or select Closed/Open testing or Production) → Create new release → upload the app-release.aab.

Review, save, and Start rollout to the chosen testing track.

Important: For the first upload you’ll be asked to accept Play App Signing if you haven’t already (see step 6). 
Android Developers

10) Store listing assets (required and common requirements)

Prepare and upload the following on the Play Console’s Store Listing page:

App icon (512×512 PNG, max 1MB).

Feature graphic (optional but recommended for promo).

Screenshots: at least 2 phone screenshots (JPEG or 24-bit PNG, no alpha). Google has specific rules: min dimension ~320 px, max 3840 px, aspect ratio constraints, and no extra device frames/text overlays in screenshots. See Play assets guidelines. 
Google Support
sommo.io

Upload clear screenshots that show actual app UI; prepare privacy policy URL and contact email.

11) Publish: internal → closed → production

Start with Internal testing to verify installs on real devices quickly. Once testers confirm, promote to Closed or Open testing, then to Production. Internal tests typically publish fast; production can take longer (hours → few days depending on review). 
Google Play
Google Support

12) After upload: checks & monitoring

Monitor Play Console for pre-launch reports, crash reports, ANRs, and policy issues.

If you push an update later, increment versionCode and build a new AAB (see step 3/7). 
Android Developers

13) Useful commands & troubleshooting tips

Generate keystore (again):

keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


(Store the .jks and passwords safely.) 
React Native

Build AAB:

cd android
./gradlew bundleRelease


Output: android/app/build/outputs/bundle/release/app-release.aab. 
React Native

Check signing fingerprint (SHA-1):

keytool -list -v -keystore my-upload-key.jks -alias my-key-alias


(Needed for some APIs like Google Sign-In.) 
Google for Developers

Common errors

validateSigningRelease FAILED → signing config issue; check keystore path/password/alias and that Gradle properties are correct.

versionCode conflict → increase versionCode.

14) Quick publish checklist (before pressing Release)

Google Play Developer account active (paid + verified). 
Google Support

App bundle .aab built and signed with your upload key. 
React Native

VersionCode incremented. 
Android Developers

Store listing: title, short description, full description. 
Google Support

Graphics: 512×512 icon, screenshots (2+), feature graphic if used. 
Google Support

App content filled: privacy policy URL, data safety, content rating, target audience. 
Google Support
+1

 Enrolled in Play App Signing (new apps). 
Android Developers

Official references (open these while you publish)

React Native — Signed release / Publish to Play (how to create keystore, set gradle variables, build .aab). 
React Native

Android Developers — Upload your app to Play Console (Play App Signing is mandatory for new apps). 
Android Developers

Play Console — Get started with Play Console (developer account & fee). 
Google Support

Google Play — Play App Signing (upload vs app signing keys explanation). 
Google Support

Play Console — Add preview assets / screenshots requirements. 
Google Support

=
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab

----
curl --location 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyBq-mlSjaQUB5bCbIcBUh8lEhQc5ClesgU' \
--header 'Content-Type: application/json' \
--data '{
  "contents":[{"parts":[{"text":"sale : 300, last month : 800 , current month : 100 check data and write short gretting message, maximum 1 or 2 line"}]}]
}'

base_url : "https://support.deverp.net/devws"

getLink : 

curl --location 'https://support.deverp.net/devws/appcode.aspx/getLink' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=jd30rho5n0cvlhmikafnk2ai' \
--data '{
  "code": "relinquo1"
}'
response d string : 
{
    "d": "{\"success\":1,\"name\":\"Relinquo Cloud ERP\",\"link\":\"https://relinquo.deverp.net/devws/\"}"
}

response : 
{
  "success": 1,
  "name": "Relinquo Cloud ERP",
  "link": "https://relinquo.deverp.net/devws/"
}

setAppId : "/setAppID"

curl --location 'https://support.deverp.net/devws/msp_api.aspx/setAppID' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=jd30rho5n0cvlhmikafnk2ai' \
--data '{
  "user": "sandip mori",
  "pass": "adgop8y",
  "appid": "appid",
  "firebaseid": "firebaseid",
  "device": "device"
}'

response d : 
{
    "d": "{\"userid\":\"113\",\"username\":\"Sandip Mori\",\"roleid\":\"6\",\"rolename\":\"HR-ADMIN\",\"mobileno\":\"8154877969\",\"emailid\":\"morisandip383@gmail.com\",\"fullname\":\"\",\"success\":\"1\",\"token\":\"87b2be6ba1b142c38593b3390c51e778\",\"validtill\":\"2026-03-20 15:52:40\"}"
}

response : 
{
  "userid": "113",
  "username": "Sandip Mori",
  "roleid": "6",
  "rolename": "HR-ADMIN",
  "mobileno": "8154877969",
  "emailid": "morisandip383@gmail.com",
  "fullname": "",
  "success": "1",
  "token": "dfab06677aee4c67930af61847cddff2",
  "validtill": "2026-03-20 15:53:39"
}

getAuth : "/getAuth"

curl --location 'https://support.deverp.net/devws/msp_api.aspx/getAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=jd30rho5n0cvlhmikafnk2ai' \
--data '{
  "appid": "appid",
  "device": "device"
}'


response d : 
{
    "d": "{\"success\":1,\"token\":\"dfab06677aee4c67930af61847cddff2\",\"validTill\":\"2026-03-20 15:53:39\"}"
}

response : 
{
  "success": 1,
  "token": "dfab06677aee4c67930af61847cddff2",
  "validTill": "2026-03-20 15:53:39"
}

getMenu : "/getMenu"

curl --location 'https://support.deverp.net/devws/msp_api.aspx/getMenu' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=jd30rho5n0cvlhmikafnk2ai' \
--data '{
  "token": "dfab06677aee4c67930af61847cddff2"
}'

response d : 
{
    "d": "{\"success\":1,\"menus\":[{\"Name\":\"Allocate Team\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Allocate Team\",\"Link\":\"AllocateTeam\",\"IsReport\":\"E\",\"Image\":\"\"},{\"Name\":\"App OTP\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"App OTP\",\"Link\":\"app/indexlist.html?APPRGLOG/\",\"IsReport\":\"A\",\"Image\":\"\"},{\"Name\":\"AppOTP Dev\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"AppOTP Dev\",\"Link\":\"app/indexlist.html?AppCode_Dev/\",\"IsReport\":\"A\",\"Image\":\"\"},{\"Name\":\"Attedance Report\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Attedance Report\",\"Link\":\"app/indexlist.html?Attendance/\",\"IsReport\":\"R\",\"Image\":\"\"},{\"Name\":\"Exp Entry\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Exp Entry\",\"Link\":\"userexp_app\",\"IsReport\":\"E\",\"Image\":\"\"},{\"Name\":\"Expense Report\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Expense Report\",\"Link\":\"app/indexlist.html?EXPENSEREPORT/\",\"IsReport\":\"R\",\"Image\":\"\"},{\"Name\":\"Leave Apply\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Leave Apply\",\"Link\":\"LeaveApp\",\"IsReport\":\"E\",\"Image\":\"\"},{\"Name\":\"Leave Auth\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Leave Auth\",\"Link\":\"LeaveAprv\",\"IsReport\":\"A\",\"Image\":\"\"},{\"Name\":\"Leave Report\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Leave Report\",\"Link\":\"app/indexlist.html?LeaveReport/\",\"IsReport\":\"R\",\"Image\":\"\"},{\"Name\":\"Temp IPS Approve\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"Temp IPS Approve\",\"Link\":\"app/indexlist.html?TempIPS_Admin/\",\"IsReport\":\"A\",\"Image\":\"\"},{\"Name\":\"User Expense\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"User Expense\",\"Link\":\"app/indexlist.html?userexp/\",\"IsReport\":\"R\",\"Image\":\"\"},{\"Name\":\"White List IP\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"White List IP\",\"Link\":\"app/indexlist.html?TempIPS/\",\"IsReport\":\"E\",\"Image\":\"\"},{\"Name\":\"WORKS REPORT\",\"Data\":\"Menu\",\"Datas\":[],\"Title\":\"WORKS REPORT\",\"Link\":\"app/indexlist.html?Works/\",\"IsReport\":\"R\",\"Image\":\"\"}]}"
}

getDB : "/getDB" 

OnBoarding screen
  3-4 step : static data

App login 

  compny code
  user name
  password 

Full screen loader 

  Company logo

Home

  Drawer 

  chart board : numeric number 
  html 
  normal text

  menu actions 

  Refresh
  Search
  Toggle list
  Filter 
    Date : From and To date
    Branch 
    Type
  Full screen




- OnBoarding - Done
- Login - Done
- List filter ui - Done 
- Date picker - crashed - Done 
- List hori/verticler - crashed  - Done
- Menu tab - rotate - crashed - Done
- Page hori/verticler - crashed - Done
- My attendace list ui - pending - hori/vertical - Done

- Custome Drop down - list cut 

- NEW - Pre-selected branch and type - home tab [manish]
- NEW - calculation - script - [Aashutosh]
- NEW - Exit app modal
- NEW - Reach us - modal
- NEW - App ratting 

- Passed Branch id instead of Branch name - home tab filter
- Passed Type id instead of Type name - home tab filter 

- Image size compress

- Drop down / Ajax / date - RESET - CLEAR - ALL RESET 
- Firebase push notification - 
- APN setup ios pending 

///// Branch wise - entry list 


////////////////////// Attendaced 4 LAYER /////////////////////////

- 0 - No Location - No Face 
- 1 - No Location - Only Face 
- 2 - YES Location - YES Face 
- 3 - YES Location - YES Face - YES Face Matched

//////////////////////





import React, { useEffect, useState, useRef } from "react";
import {
  PermissionsAndroid,
  Platform,
  NativeModules,
  AppState,
  Linking,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  checkAuthStateThunk,
  getERPAppConfigMenuThunk,
} from "../store/slices/auth/thunk";
import DevERPService from "../services/api/deverp";
import AuthNavigator from "./AuthNavigator";
import StackNavigator from "./StackNavigator";
import FullViewLoader from "../components/loader/FullViewLoader";
import DeviceInfo from "react-native-device-info";
import CustomAlert from "../components/alert/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ERP_COLOR_CODE } from "../utils/constants";
import { changeLanguage } from "../i18n";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { getLastPunchInThunk } from "../store/slices/attendance/thunk";
import { setReloadApp } from "../store/slices/reloadApp/reloadAppSlice";
import {
  updateAppMenuList,
  updateAttendanceState,
  updatePinVerifyLoadedState,
} from "../store/slices/auth/authSlice";
import { useTranslation } from "react-i18next";

// ------------------------- Location Permission Helper -------------------------
export async function requestLocationPermissions(): Promise<
  "granted" | "foreground-only" | "denied" | "blocked"
> {
  if (Platform.OS === "android") {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (fine === PermissionsAndroid.RESULTS.GRANTED) {
      // Ask background AFTER foreground
      const background = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      return background === PermissionsAndroid.RESULTS.GRANTED
        ? "granted"
        : "foreground-only";
    }

    if (fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return "blocked";
    }

    return "denied";
  }

  // -------------------- iOS --------------------
  const whenInUse = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

  if (whenInUse === RESULTS.GRANTED || whenInUse === RESULTS.LIMITED) {
    const always = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    return always === RESULTS.GRANTED ? "granted" : "foreground-only";
  }

  if (whenInUse === RESULTS.BLOCKED) {
    return "blocked";
  }

  return "denied";
}

// ------------------------- RootNavigator -------------------------
const RootNavigator = () => {
  let ATTENDANCE_LEVEL = 1;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const LOCATION_MESSAGES = {
    PERMISSION_DENIED: t("text1"),
    SERVICE_DISABLED: t("text2"),
  };
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const { isLoading, isAuthenticated, accounts, user, appColorCode } =
    useAppSelector((state) => state.auth);
  const { reLoading } = useAppSelector((state) => state.reloadApp);

  const langCode = useAppSelector((state) => state.theme.langcode);

  const [alertVisible, setAlertVisible] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [backgroundDeniedModal, setBackgroundDeniedModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "error" as "error" | "success" | "info" | "location",
  });

  const locationModalShownRef = useRef(false);
  const appState = useRef(AppState.currentState);

  const locationServiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gpsModalShownRef = useRef(false);

  const checkLocationServiceOnly = async () => {
    if (!isAuthenticated) return;

    const enabled = await DeviceInfo.isLocationEnabled();

    // GPS OFF → show modal once & stop features
    if (!enabled && !gpsModalShownRef.current) {
      setAlertConfig({
        title: t("test3"),
        message: LOCATION_MESSAGES.SERVICE_DISABLED,
        type: "location",
      });

      setAlertVisible(true);
      setOpenSettings(false);
      setBackgroundDeniedModal(false);

      gpsModalShownRef.current = true;
      locationModalShownRef.current = true; // reuse existing stop-flow logic
      return;
    }

    // GPS ON again → reset flags & resume
    if (enabled && gpsModalShownRef.current) {
      gpsModalShownRef.current = false;
      locationModalShownRef.current = false;
      setAlertVisible(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Start checking every 1 second
    locationServiceIntervalRef.current = setInterval(() => {
      if (ATTENDANCE_LEVEL !== 0) {
        try {
          dispatch(getLastPunchInThunk())
            .unwrap()
            .then((res) => {
              if (res?.success === 1 || res?.success === "1") {
                dispatch(updateAttendanceState(true));
                checkLocationServiceOnly();
              } else {
                dispatch(updateAttendanceState(false));
              }
            })
            .catch((err) => {
              dispatch(updateAttendanceState(false));
            });
        } catch (error) {
          dispatch(updateAttendanceState(false));

          console.log("error ", error);
        }
      }
    }, 1000);

    return () => {
      // Cleanup on logout / unmount
      if (locationServiceIntervalRef.current) {
        clearInterval(locationServiceIntervalRef.current);
        locationServiceIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, reLoading]);
  const app_id = user?.app_id;

  useEffect(() => {
    if (isAuthenticated) {
      try {
        dispatch(getERPAppConfigMenuThunk());
      } catch (error) {
        dispatch(updateAppMenuList([])); // Clear menu on error
        console.log("Error fetching app config menu:", error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchDeviceName = async () => {
      const name = await DeviceInfo.getDeviceName();
      let appid = await AsyncStorage.getItem("appid");
      if (!appid) {
        appid = app_id;
        await AsyncStorage.setItem("appid", appid || "");
      }
      await AsyncStorage.setItem("device", name);

      DevERPService.initialize();
      DevERPService.setAppId(appid || "");
      DevERPService.setDevice(name);

      dispatch(checkAuthStateThunk());
    };
    fetchDeviceName();
  }, [dispatch]);

  // ------------------------- AppState Listener -------------------------
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (ATTENDANCE_LEVEL !== 0) {
          try {
            dispatch(getLastPunchInThunk())
              .unwrap()
              .then((res) => {
                if (res?.success === 1 || res?.success === "1") {
                  dispatch(updateAttendanceState(true));

                  checkLocation();
                } else {
                  dispatch(updateAttendanceState(false));
                }
              })
              .catch((err) => {
                dispatch(updateAttendanceState(false));
              });
          } catch (error) {
            dispatch(updateAttendanceState(false));

            console.log("error*******", error);
          }
        }
      }
      appState.current = nextAppState;
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [isAuthenticated, reLoading]);

  // ------------------------- Language -------------------------
  useEffect(() => {
    changeLanguage(langCode);
  }, [langCode]);

  // ------------------------- Device Setup -------------------------
  const init = async () => {
    const name = await DeviceInfo.getDeviceName();
    await AsyncStorage.setItem("device", name);
    await DevERPService.initialize();
    await dispatch(checkAuthStateThunk());
  };

  // ------------------------- Check Location -------------------------
  const checkLocation = async () => {
    if (!isAuthenticated) return;

    const enabled = await DeviceInfo.isLocationEnabled();

    const permission = await requestLocationPermissions();

    if (enabled && permission === "granted") {
      locationModalShownRef.current = false;
      setAlertVisible(false);
      setBackgroundDeniedModal(false);

      if (accounts.length) {
        const data = accounts
          .map((u) => {
            if (user?.id.toString() === u?.user?.id.toString()) {
              return {
                token: u.user.token,
                link: u.user.companyLink.replace(/^https:\/\//i, "http://"),
              };
            }
            return null;
          })
          .filter(Boolean);

        NativeModules.LocationModule.setUserTokens(data);
        NativeModules.LocationModule.startService();
      }
      return;
    }

    if (permission === "foreground-only") {
      setBackgroundDeniedModal(true);
      setAlertVisible(false);
      return;
    }

    // ------------------------- Denied / Disabled Handling -------------------------
    if (!locationModalShownRef.current) {
      // CASE 1: Location service disabled (GPS OFF)
      if (!enabled) {
        setAlertConfig({
          title: t("test3"),
          message: LOCATION_MESSAGES.SERVICE_DISABLED,
          type: "location",
        });

        setAlertVisible(true);
        setOpenSettings(false);
        setBackgroundDeniedModal(false); // ❌ no Open Settings modal
        locationModalShownRef.current = true;
        return;
      }

      // CASE 2: Permission denied or blocked
      if (permission === "denied" || permission === "blocked") {
        setAlertConfig({
          title: "Permission Denied",
          message: LOCATION_MESSAGES.PERMISSION_DENIED,
          type: "location",
        });

        setAlertVisible(true);
        setOpenSettings(true);
        setBackgroundDeniedModal(false); // ❌ background modal not needed here
        locationModalShownRef.current = true;
        return;
      }
    }
  };

  useEffect(() => {
    init();
    return () => {
      dispatch(setReloadApp());
      dispatch(updatePinVerifyLoadedState(false));
    };
  }, []);

  // ------------------------- Focus -------------------------
  useEffect(() => {
    if (isAuthenticated) {
      // Optional: cancel timeout if component unmounts
      const timer = setTimeout(() => {
        if (ATTENDANCE_LEVEL !== 0) {
          try {
            dispatch(getLastPunchInThunk())
              .unwrap()
              .then((res) => {
                if (res?.success === 1 || res?.success === "1") {
                  dispatch(updateAttendanceState(true));

                  checkLocation();
                } else {
                  dispatch(updateAttendanceState(false));

                  setAlertVisible(false);
                  setOpenSettings(false);
                  setBackgroundDeniedModal(false);
                  NativeModules.LocationModule.setUserTokens([]);
                  NativeModules.LocationModule.stopService();
                }
              })
              .catch((err) => {
                dispatch(updateAttendanceState(false));

                setAlertVisible(false);
                setOpenSettings(false);
                setBackgroundDeniedModal(false);
                NativeModules.LocationModule.setUserTokens([]);
                NativeModules.LocationModule.stopService();
              });
          } catch (error) {
            dispatch(updateAttendanceState(false));

            console.log("error//////", error);
          }
        }
      }, 2500);
      // Cleanup to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, reLoading]);

  // ------------------------- Render -------------------------
  if (isLoading) return <FullViewLoader />;

  return (
    <>
      {isAuthenticated ? <StackNavigator /> : <AuthNavigator />}
      {ATTENDANCE_LEVEL !== 0 && isAuthenticated && (
        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => {
            // setAlertVisible(true)
          }}
          isSettingVisible={openSettings}
          actionLoader={undefined}
          closeHide={true}
        />
      )}
      {ATTENDANCE_LEVEL !== 0 && isAuthenticated && (
        <Modal
          visible={backgroundDeniedModal}
          supportedOrientations={["portrait", "landscape"]}
          transparent
        >
          <View
            style={[
              styles.overlay,
              isLandscape && {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View style={[styles.modalContainer, {}]}>
              <Text style={styles.title}>{t("test21")}</Text>
              <Text style={styles.message}>{t("test22")}</Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.btnText}>{t("test23")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default RootNavigator;

// ------------------------- Styles -------------------------
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    padding: 12,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});


-----


import {
  View,
  Text,
  Image,
  TextInput,
  AppState,
  Animated,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Geolocation from "@react-native-community/geolocation";

import { AttendanceFormValues, UserLocation } from "../types";
import {
  firstLetterUpperCase,
  requestCameraAndLocationPermission,
  requestCameraPermissionV2,
} from "../../../../utils/helpers";
import useTranslations from "../../../../hooks/useTranslations";
import { styles } from "../attendance_style";
import CustomAlert from "../../../../components/alert/CustomAlert";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { markAttendanceThunk } from "../../../../store/slices/attendance/thunk";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import SlideButton from "./SlideButton";
import { useBaseLink } from "../../../../hooks/useBaseLink";
import ProfileImage from "../../../../components/profile/ProfileImage";
import DeviceInfo from "react-native-device-info";
import { setReloadApp } from "../../../../store/slices/reloadApp/reloadAppSlice";
import { Easing } from "react-native";
import ImageBottomSheetModal from "../../../../components/bottomsheet/ImageBottomSheetModal";
import TranslatedText from "../../tabs/home/TranslatedText";
import { updateAttendanceState } from "../../../../store/slices/auth/authSlice";
import SlideButtonIOS from "./SlideButtonIOS";
import RNFS from "react-native-fs";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { launchCamera } from "react-native-image-picker";

const AttendanceForm = ({ setBlockAction, resData }: any) => {
  const { t } = useTranslations();

  let ATTENDANCE_LEVEL = 1;

  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user, attendanceDone: isAttendanceDone } = useAppSelector(
    (state) => state?.auth,
  );

  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const baseLink = useBaseLink();
  const theme = useAppSelector((state) => state?.theme.mode);
  const [statusImage, setStatusImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [attendanceDone, setAttendanceDone] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [alertLocationVisible, setLocationAlertVisible] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info",
  });
  const [alertMapVisible, setAlertMapVisible] = useState(false);

  const [alertMapConfig, setAlertMapConfig] = useState({
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info" | "location",
  });
  // -------------------- Pending Camera Action --------------------
  const pendingCameraAction = useRef<{
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void;
    handleSubmit: () => void;
  } | null>(null);

  // -------------------- AppState Listener --------------------
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if(ATTENDANCE_LEVEL === 0) return;
        if (nextAppState === "active" && pendingCameraAction.current) {
           const hasPermission = await requestCameraAndLocationPermission();
            if (hasPermission) {
              setIsSettingVisible(false);
              setAlertVisible(false);
              const { setFieldValue, handleSubmit } =
                pendingCameraAction.current;
              pendingCameraAction.current = null;
              if(ATTENDANCE_LEVEL === 1){
            openCamera(setFieldValue, handleSubmit);
          } else {
            openCameraV2(setFieldValue, handleSubmit);
          }
            }
        }
      },
    );
    return () => subscription.remove();
  }, []);


  const openCamera = (setFieldValue, handleSubmit) => {

    if(ATTENDANCE_LEVEL === 0){
      setFieldValue(
                "imageBase64",
                 "",
              );

         setTimeout(() => {
              handleSubmit();
            }, 1000);
    }else{
      setLocationLoading(false);
    setBlockAction(false);
    navigation.navigate("FaceCameraScreen", {
      onCapture: async (photoPath) => {
        setTimeout(async () => {
          try {
            setLocationLoading(true);
            setBlockAction(true);
            if (!photoPath) {
              setLocationLoading(false);
              setBlockAction(false);
              return;
            }

            const photoUri = "file://" + photoPath;
            const compressedPhoto = await ImageResizer.createResizedImage(
              photoPath,
              600, // optional: adjust to safe dimensions
              600,
              "JPEG",
              60,
              0,
            );

            const base64 = await RNFS.readFile(compressedPhoto.uri, "base64");
            // const base64 = await RNFS.readFile(photoPath, "base64");

            if (base64) {
              setFieldValue(
                "imageBase64",
                `${
                  resData?.success === 1 || resData?.success === "1"
                    ? "punchOut.jpeg"
                    : "punchIn.jpeg"
                }; data:image/jpeg;base64,${base64}`,
              );
            }

            setStatusImage(photoUri);

            setTimeout(() => {
              handleSubmit();
            }, 1000);
          } catch (error) {
            console.log("---------------------11", error);

            setLocationLoading(false);
            setBlockAction(false);
          }
        }, 300);
      },
    });
    }

    
  };

  const openCameraV2 = (
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void,
    handleSubmit: () => void,
  ) => {
    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        quality: 0.7,
        includeBase64: true,
      },
      (response) => {
        if (response?.didCancel || response?.errorCode) {
          setLocationLoading(false);
          setBlockAction(false);
          return;
        }
        const photoUri = response?.assets?.[0]?.uri;
        const asset = response?.assets?.[0];
        if (!photoUri) return;
        if (asset?.base64) {
          setFieldValue(
            "imageBase64",
            `${
              resData?.success === 1 || resData?.success === "1"
                ? "punchOut.jpeg"
                : "punchIn.jpeg"
            }; data:${asset?.type};base64,${asset?.base64}`,
          );
        }
        setStatusImage(photoUri);
        setTimeout(() => {
          handleSubmit();
        }, 1000);
      },
    );
  };


  const handleStatusToggle = async (
    setFieldValue: (field: keyof AttendanceFormValues, value: any) => void,
    handleSubmit: () => void,
  ) => {
    const enabled = await DeviceInfo.isLocationEnabled();
    if (ATTENDANCE_LEVEL !== 0 && !enabled) {
      setBlocked(false);
      setLocationLoading(false);
      setAttendanceDone(false);
      setLocationAlertVisible(true);
      return;
    } else {
      setLocationAlertVisible(false);
    }
    setBlockAction(true);

    if (locationLoading) return;

    
    if(ATTENDANCE_LEVEL !== 0){
      const hasPermission = await requestCameraAndLocationPermission();

      if (!hasPermission) {
        pendingCameraAction.current = { setFieldValue, handleSubmit };
        setAlertConfig({
          title: t("errors.permissionRequired"),
          message: t("errors.cameraLocationPermission"),
          type: "error",
        });
        setModalClose(false);
        setAlertVisible(true);
        setIsSettingVisible(true);

        setBlockAction(false);
        return;
      }
    }

    setBlocked(false);
    setLocationLoading(true);

    const getLocationWithRetry = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;

          setUserLocation({ latitude, longitude });
          setFieldValue("latitude", String(latitude));
          setFieldValue("longitude", String(longitude));
          if(ATTENDANCE_LEVEL === 1){
            openCameraV2(setFieldValue, handleSubmit);
          } else {
            openCamera(setFieldValue, handleSubmit);
          }
        },
        (error) => {
          console.log("-----------------------******", error);

          setAlertConfig({
            title: t("errors.locationError"),
            message: error?.message || t("msg.msg5"),
            type: "error",
          });
          setAlertVisible(true);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    if (ATTENDANCE_LEVEL !== 0) {
      getLocationWithRetry();
    } else {
      console.log("Skipping location fetch due to attendance level 0");
      setFieldValue("latitude", "");
      setFieldValue("longitude", "");
      setFieldValue("imageBase64", "");
          setTimeout(() => {
        handleSubmit(); // ✅ yaha sahi hai
      }, 1000);
    }
  };

  const formatName = (name = "") =>
    name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const animProfile = useRef(new Animated.Value(20)).current;
  const animName = useRef(new Animated.Value(20)).current;
  const animRemark = useRef(new Animated.Value(20)).current;
  const animImage = useRef(new Animated.Value(20)).current;
  const animButton = useRef(new Animated.Value(20)).current;

  const fadeProfile = useRef(new Animated.Value(0)).current;
  const fadeName = useRef(new Animated.Value(0)).current;
  const fadeRemark = useRef(new Animated.Value(0)).current;
  const fadeImage = useRef(new Animated.Value(0)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(animProfile, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeProfile, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(animName, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeName, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(animRemark, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeRemark, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(animImage, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeImage, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(animButton, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeButton, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        padding: 16,
      }}
    >
      <Formik
        initialValues={{
          name: user?.name,
          latitude: ATTENDANCE_LEVEL === 1 ? userLocation ? String(userLocation?.latitude) : "" : "",
          longitude: ATTENDANCE_LEVEL === 1 ? userLocation ? String(userLocation?.longitude) : "" : "",
          remark: "",
          dateTime: new Date().toISOString(),
          imageBase64: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(t("attendance.nameRequired")),
          longitude: Yup.string().optional(),
          remark: Yup.string().optional(),
          dateTime: Yup.string().optional(),
          imageBase64:  ATTENDANCE_LEVEL === 0 ?  Yup.string().optional() : Yup.string().required(t("msg.msg6")),
        })}
        onSubmit={(values) => {
          console.log("Submitting with values:", values);
          dispatch(
            markAttendanceThunk({
              rawData: values,
              type:
                resData?.success === 1 || resData?.success === "1"
                  ? false
                  : true,
              user,
              id:
                resData?.success === 1 || resData?.success === "1"
                  ? resData?.id
                  : "0",
            }),
          )
            .unwrap()
            .then((res) => {
              if (resData?.success === 1 || resData?.success === "1") {
                dispatch(updateAttendanceState(true));
              } else {
                dispatch(updateAttendanceState(false));
              }
              setAttendanceDone(true);
              setAlertConfig({
                title: t("title.title3"),
                message: t("msg.msg7"),
                type: "success",
              });
              setAlertVisible(true);
              setLocationLoading(false);
              setBlockAction(false);
              if(ATTENDANCE_LEVEL === 0){
                navigation.goBack();
                return;
              }
              setTimeout(() => {
                setAlertVisible(false);
                setAlertMapVisible(true);

                setAlertMapConfig({
                  title: "Location tracked status",
                  message: !isAttendanceDone
                    ? "Location tracking has started and will continue until you punch out."
                    : "Location tracking has been stopped.",
                  type: "location",
                });

                setTimeout(() => {
                  setAlertMapVisible(false);
                  navigation.goBack();
                }, 1500);
              }, 1100);
            })
            .catch((err) => {
              setAttendanceDone(false);
              setAlertConfig({
                title: t("title.title1"),
                message: err || t("msg.msg4"),
                type: "error",
              });
              setAlertVisible(true);
              setLocationLoading(false);
              setBlockAction(false);
            });
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: theme === "dark" ? "black" : "transparent",
              },
            ]}
          >
            {isLandscape ? (
              <>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%", justifyContent: "center" }}>
                    <View style={styles.profileRow}>
                      <View style={styles.imageCol}>
                        {`${baseLink}/FileUpload/1/UserMaster/${user?.id}/profileimage.jpeg` ? (
                          <TouchableOpacity
                            onPress={() => {
                              setImg(
                                `${baseLink}/FileUpload/1/UserMaster/${user?.id}/profileimage.jpeg`,
                              );
                              setShowModal(true);
                            }}
                          >
                            <Animated.View
                              style={{
                                opacity: fadeProfile,
                                transform: [{ translateY: animProfile }],
                              }}
                            >
                              <View style={styles.profileRow}>
                                <ProfileImage
                                  userId={user?.id}
                                  baseLink={baseLink}
                                  userName={firstLetterUpperCase(
                                    user?.name || "",
                                  )}
                                />
                              </View>
                            </Animated.View>
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.profileAvatar,
                              {
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                              },
                            ]}
                          >
                            <Animated.View
                              style={{
                                opacity: fadeName,
                                transform: [{ translateY: animName }],
                              }}
                            >
                              <TranslatedText
                                text={firstLetterUpperCase(user?.name || "")}
                                numberOfLines={1}
                                style={{
                                  color: ERP_COLOR_CODE.ERP_WHITE,
                                  fontWeight: "bold",
                                  fontSize: 26,
                                }}
                              ></TranslatedText>
                            </Animated.View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{}}>
                      <Animated.View
                        style={{
                          opacity: fadeRemark,
                          transform: [{ translateY: animRemark }],
                        }}
                      >
                        <View style={styles.formGroup}>
                          <Text
                            style={[
                              styles.label,
                              theme === "dark" && {
                                color: "white",
                              },
                            ]}
                          >
                            {t("attendance.employeeName")}
                          </Text>
                          <TextInput
                            style={[
                              styles.input,
                              styles.inputReadonly,
                              theme === "dark" && {
                                borderWidth: 1,
                                borderColor: "white",
                                color: "black",
                                backgroundColor: "black",
                              },
                              {
                                backgroundColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
                              },
                            ]}
                            value={formatName(values?.name)}
                            editable={false}
                          />
                          {touched?.name && errors?.name ? (
                            <TranslatedText
                              numberOfLines={1}
                              text={errors?.name}
                              style={styles.errorText}
                            ></TranslatedText>
                          ) : null}
                        </View>
                        <View style={styles.formGroup}>
                          <Text
                            style={[
                              styles.label,
                              theme === "dark" && {
                                color: "white",
                              },
                            ]}
                          >
                            {resData?.success === 1 || resData?.success === "1"
                              ? t("attendance.outremark")
                              : t("attendance.remark")}
                          </Text>

                          <TextInput
                            style={[
                              styles.input,
                              { minHeight: 100, textAlignVertical: "top" },
                              theme === "dark" && {
                                borderWidth: 1,
                                borderColor: "white",
                                color: "white",
                                backgroundColor: "black",
                              },
                            ]}
                            placeholderTextColor={
                              theme === "dark" ? "white" : "black"
                            }
                            value={values?.remark}
                            onChangeText={(text) =>
                              setFieldValue("remark", text)
                            }
                            placeholder={t("attendance.enterRemark")}
                            multiline
                            numberOfLines={3}
                          />
                        </View>
                      </Animated.View>
                      {statusImage && (
                        <View>
                          <Image
                            source={{ uri: statusImage }}
                            style={styles.selfyAvatar}
                          />
                          <Text style={styles.imageLabel}>
                            {t("attendance.capturedPhoto")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Animated.View
                          style={{
                            opacity: fadeButton,
                            transform: [{ translateY: animButton }],
                          }}
                        >
                          <View>
                            {Platform.OS === "ios" ? (
                              <SlideButtonIOS
                                label={
                                  resData?.success === 1 ||
                                  resData?.success === "1"
                                    ? `${t("text.texti3")} ${t(
                                        "attendance.checkOut",
                                      )}`
                                    : `${t("text.texti3")} ${t(
                                        "attendance.checkIn",
                                      )}`
                                }
                                successColor={
                                  resData?.success === 1 ||
                                  resData?.success === "1"
                                    ? ERP_COLOR_CODE.ERP_ERROR
                                    : ERP_COLOR_CODE.ERP_APP_COLOR
                                }
                                loading={locationLoading}
                                completed={attendanceDone}
                                onSlideSuccess={() => {
                                  handleStatusToggle(
                                    setFieldValue,
                                    handleSubmit,
                                  );
                                }}
                              />
                            ) : (
                              <SlideButton
                                label={
                                  resData?.success === 1 ||
                                  resData?.success === "1"
                                    ? `${t("text.text3")} ${t(
                                        "attendance.checkOut",
                                      )}`
                                    : `${t("text.text3")} ${t(
                                        "attendance.checkIn",
                                      )}`
                                }
                                successColor={
                                  resData?.success === 1 ||
                                  resData?.success === "1"
                                    ? ERP_COLOR_CODE.ERP_ERROR
                                    : ERP_COLOR_CODE.ERP_APP_COLOR
                                }
                                loading={locationLoading}
                                completed={attendanceDone}
                                blocked={blocked}
                                onSlideSuccess={() => {
                                  handleStatusToggle(
                                    setFieldValue,
                                    handleSubmit,
                                  );
                                }}
                              />
                            )}
                          </View>
                        </Animated.View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.profileRow}>
                  <View style={styles.imageCol}>
                    {`${baseLink}/FileUpload/1/UserMaster/${user?.id}/profileimage.jpeg` ? (
                      <TouchableOpacity
                        onPress={() => {
                          setImg(
                            `${baseLink}/FileUpload/1/UserMaster/${user?.id}/profileimage.jpeg`,
                          );
                          setShowModal(true);
                        }}
                      >
                        <Animated.View
                          style={{
                            opacity: fadeProfile,
                            transform: [{ translateY: animProfile }],
                          }}
                        >
                          <View style={styles.profileRow}>
                            <ProfileImage
                              userId={user?.id}
                              baseLink={baseLink}
                              userName={firstLetterUpperCase(user?.name || "")}
                            />
                          </View>
                        </Animated.View>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={[
                          styles.profileAvatar,
                          {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                          },
                        ]}
                      >
                        <Animated.View
                          style={{
                            opacity: fadeName,
                            transform: [{ translateY: animName }],
                          }}
                        >
                          <TranslatedText
                            text={firstLetterUpperCase(user?.name || "")}
                            numberOfLines={1}
                            style={{
                              color: ERP_COLOR_CODE.ERP_WHITE,
                              fontWeight: "bold",
                              fontSize: 26,
                            }}
                          ></TranslatedText>
                        </Animated.View>
                      </View>
                    )}
                  </View>
                </View>

                <View style={{}}>
                  <Animated.View
                    style={{
                      opacity: fadeRemark,
                      transform: [{ translateY: animRemark }],
                    }}
                  >
                    <View style={styles.formGroup}>
                      <Text
                        style={[
                          styles.label,
                          theme === "dark" && {
                            color: "white",
                          },
                        ]}
                      >
                        {t("attendance.employeeName")}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.inputReadonly,
                          theme === "dark" && {
                            borderWidth: 1,
                            borderColor: "white",
                            color: "black",
                            backgroundColor: "black",
                          },
                          { backgroundColor: ERP_COLOR_CODE.ERP_BORDER_LINE },
                        ]}
                        value={formatName(values?.name)}
                        editable={false}
                      />
                      {touched?.name && errors?.name ? (
                        <TranslatedText
                          numberOfLines={1}
                          text={errors?.name}
                          style={styles.errorText}
                        ></TranslatedText>
                      ) : null}
                    </View>
                    <View style={styles.formGroup}>
                      <Text
                        style={[
                          styles.label,
                          theme === "dark" && {
                            color: "white",
                          },
                        ]}
                      >
                        {resData?.success === 1 || resData?.success === "1"
                          ? t("attendance.outremark")
                          : t("attendance.remark")}
                      </Text>

                      <TextInput
                        style={[
                          styles.input,
                          { minHeight: 100, textAlignVertical: "top" },
                          theme === "dark" && {
                            borderWidth: 1,
                            borderColor: "white",
                            color: "white",
                            backgroundColor: "black",
                          },
                        ]}
                        placeholderTextColor={
                          theme === "dark" ? "white" : "black"
                        }
                        value={values?.remark}
                        onChangeText={(text) => setFieldValue("remark", text)}
                        placeholder={t("attendance.enterRemark")}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </Animated.View>
                  {statusImage && (
                    <View>
                      <Image
                        source={{ uri: statusImage }}
                        style={styles.selfyAvatar}
                      />
                      <Text style={styles.imageLabel}>
                        {t("attendance.capturedPhoto")}
                      </Text>
                    </View>
                  )}
                  <Animated.View
                    style={{
                      opacity: fadeButton,
                      transform: [{ translateY: animButton }],
                    }}
                  >
                    <View>
                      {Platform.OS === "ios" ? (
                        <SlideButtonIOS
                          label={
                            resData?.success === 1 || resData?.success === "1"
                              ? `${t("text.texti3")} ${t(
                                  "attendance.checkOut",
                                )}`
                              : `${t("text.texti3")} ${t("attendance.checkIn")}`
                          }
                          successColor={
                            resData?.success === 1 || resData?.success === "1"
                              ? ERP_COLOR_CODE.ERP_ERROR
                              : ERP_COLOR_CODE.ERP_APP_COLOR
                          }
                          loading={locationLoading}
                          completed={attendanceDone}
                          onSlideSuccess={() => {
                            handleStatusToggle(setFieldValue, handleSubmit);
                          }}
                        />
                      ) : (
                        <SlideButton
                          label={
                            resData?.success === 1 || resData?.success === "1"
                              ? `${t("text.text3")} ${t("attendance.checkOut")}`
                              : `${t("text.text3")} ${t("attendance.checkIn")}`
                          }
                          successColor={
                            resData?.success === 1 || resData?.success === "1"
                              ? ERP_COLOR_CODE.ERP_ERROR
                              : ERP_COLOR_CODE.ERP_APP_COLOR
                          }
                          loading={locationLoading}
                          completed={attendanceDone}
                          blocked={blocked}
                          onSlideSuccess={() => {
                            handleStatusToggle(setFieldValue, handleSubmit);
                          }}
                        />
                      )}
                    </View>
                  </Animated.View>
                </View>
              </>
            )}
          </View>
        )}
      </Formik>

      <ImageBottomSheetModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        imageUrl={img}
      />

      <CustomAlert
        visible={alertLocationVisible}
        title={t("title.title4")}
        message={t("msg.msg8")}
        type={"error"}
        onClose={() => {
          setBlocked(true);
          setAlertVisible(false);
          setTimeout(() => {
            setBlocked(false);
          }, 1000);
          setLocationLoading(false);
          setAttendanceDone(false);
          setLocationAlertVisible(false);
        }}
        actionLoader={undefined}
        isSettingVisible={false}
        closeHide={undefined}
      />

      <CustomAlert
        visible={alertMapVisible}
        title={alertMapConfig?.title}
        message={alertMapConfig?.message}
        type={alertMapConfig?.type}
        onClose={() => {
          navigation?.goBack();
          setAlertMapVisible(false);
          dispatch(setReloadApp());
        }}
        actionLoader={undefined}
        isSettingVisible={false}
        closeHide={undefined}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertConfig?.title}
        message={alertConfig?.message}
        type={alertConfig?.type}
        onClose={() => {
          if (!modalClose) {
            if (attendanceDone) {
              navigation?.goBack();
              setAlertVisible(false);
            } else {
              setBlocked(true);
              setAlertVisible(false);
              setTimeout(() => {
                setBlocked(false);
              }, 1000);
            }
          }
        }}
        actionLoader={undefined}
        isSettingVisible={isSettingVisible}
        closeHide={undefined}
      />
    </View>
  );
};

export default AttendanceForm;

//https://azure.microsoft.com/en-in/pricing/free-services/
svg - onboarding screen
two times load - list page
sometime show NoData - on first load
list back - 
  search result 
  add new
  come back
   -- entered search clean - keep value
Update app version number - android and ios
web site load fail - ios

// same page config 
// --





import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  PermissionsAndroid,
  AppState,
  useWindowDimensions,
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getERPAppConfigMenuThunk,
  getERPPageThunk,
} from "../../../store/slices/auth/thunk";
import { savePageThunk } from "../../../store/slices/page/thunk";
import FullViewLoader from "../../../components/loader/FullViewLoader";
import NoData from "../../../components/no_data/NoData";
import ErrorMessage from "../../../components/error/Error";
import ERPIcon from "../../../components/icon/ERPIcon";
import ErrorModal from "./components/ErrorModal";
import CustomPicker from "./components/CustomPicker";
import Media from "./components/Media";
import Disabled from "./components/Disabled";
import Input from "./components/Input";
import CustomAlert from "../../../components/alert/CustomAlert";
import AjaxPicker from "./components/AjaxPicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  applyActionsToControls,
  applyFormula,
  evaluateRulesWithActions,
  parseCustomDatePage,
  requestCameraPermission,
  runDynamicRules,
} from "../../../utils/helpers";
import DateRow from "./components/Date";
import BoolInput from "./components/BoolInput";
import SignaturePad from "./components/SignaturePad";
import HtmlRow from "./components/HtmlRow";
import { useBaseLink } from "../../../hooks/useBaseLink";
import DateTimeRow from "./components/DateTimeRow";
import LocationRow from "./components/LocationRow";
import FilePickerRow from "./components/FilePicker";
import CustomMultiPicker from "./components/CustomMultiPicker";
import { ERP_COLOR_CODE } from "../../../utils/constants";
import BusinessCardView from "./components/BusinessCardImage";
import DeviceInfo from "react-native-device-info";
import useTranslations from "../../../hooks/useTranslations";
import VideoRecorder from "./components/VideoRecorder";
import ScanScreen from "./components/ScanScreen";
import BarCodeScan from "./components/BarCodeScan";
import TranslatedText from "../tabs/home/TranslatedText";
import { setReloadApp } from "../../../store/slices/reloadApp/reloadAppSlice";
import { updateAppMenuList } from "../../../store/slices/auth/authSlice";

type PageRouteParams = { PageScreen: { item: any } };

export async function requestLocationPermissions(): Promise<
  "granted" | "foreground-only" | "denied" | "blocked"
> {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      const fine = granted["android.permission.ACCESS_FINE_LOCATION"];
      const coarse = granted["android.permission.ACCESS_COARSE_LOCATION"];
      const background =
        granted["android.permission.ACCESS_BACKGROUND_LOCATION"];

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return "granted";
      }

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        return "foreground-only";
      }

      if (
        fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        background === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return "blocked";
      }
      return "denied";
    } catch (err) {
      return "denied";
    }
  }
  return "granted";
}

const PageScreen = () => {
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);
  const baseLink = useBaseLink();
  const theme = useAppSelector((state) => state?.theme.mode);
  const { t } = useTranslations();
  const [buttonSave, setButtonSave] = useState(true);
  const [loadingPageId, setLoadingPageId] = useState<string | null>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  const [tapLoader, setTapLoader] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState<string | null>(
    null,
  );
  const [activeDateTime, setActiveDateTime] = useState<string | null>(null);

  const [activeDateField, setActiveDateField] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [loader, setLoader] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [actionSaveLoader, setActionSaveLoader] = useState(false);
  const [infoData, setInfoData] = useState<any>({});
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info",
  });

  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [modalClose, setModalClose] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [myScript, setMyScript] = useState();

  console.log("myScript---------------------", myScript);
  const [backgroundDeniedModal, setBackgroundDeniedModal] = useState(false);

  const isCheckingPermission = useRef(false);
  const locationSyncInterval = useRef<NodeJS.Timeout | null>(null);
  const lastLocationEnabled = useRef<boolean | null>(null);
  const appState = useRef(AppState.currentState);
  const [scriptErrorMessage, setScriptErrorMessage] = useState<any>();
  const [isVisibleScriptError, setIsVisibleScriptError] = useState(false);

  const hasLocationField = controls.some(
    (item) =>
      item?.defaultvalue &&
      item?.defaultvalue === "#location" &&
      item?.visible === "0",
  );

  const hasMediaField = controls.some(
    (item) => item?.ctltype === "IMAGE" || item?.ctltype === "PHOTO",
  );

  useFocusEffect(
    useCallback(() => {
      setTapLoader(false);
      return () => {};
    }, [navigation]),
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkLocation = async () => {
      const enabled = await DeviceInfo.isLocationEnabled();
      setLocationEnabled(enabled);
    };

    checkLocation();

    interval = setInterval(checkLocation, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    return true;
  };

  const startLocationSync = async () => {
    const enabled = await DeviceInfo.isLocationEnabled();
    if (!enabled) return;

    const hasPermission = await requestLocationPermission();
    const fullPermission = await requestLocationPermissions();

    if (fullPermission === "foreground-only") {
      setBackgroundDeniedModal(true);
      return;
    }

    if (
      !hasPermission ||
      fullPermission === "denied" ||
      fullPermission === "blocked"
    )
      return;

    if (locationSyncInterval.current)
      clearInterval(locationSyncInterval.current);

    checkLocation();
  };

  const checkLocation = async () => {
    try {
      const enabled = await DeviceInfo.isLocationEnabled();

      if (enabled !== locationEnabled) {
        setAlertConfig({
          title: t("title.title13"),
          message: enabled ? t("title.title14") : t("title.title15"),
          type: enabled ? "success" : "error",
        });
        setAlertVisible(!enabled);
        setModalClose(false);
        setLocationEnabled(enabled);
      }

      if (hasLocationField && enabled) {
        if (Platform.OS === "android") {
          const granted = await requestLocationPermissions();
          if (granted === "granted") {
            // location access
            setLocationVisible(true);
          } else if (granted === "foreground-only") {
            setBackgroundDeniedModal(true);
            setLocationVisible(true);
          }
        }
      }
    } catch (err) {
      setLocationVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkPermissionsOnFocus = async () => {
        if (isCheckingPermission.current) return;
        isCheckingPermission.current = true;

        const hasPermission = await requestLocationPermission();
        const fullPermission = await requestLocationPermissions();

        if (hasPermission && fullPermission === "granted") {
          setAlertVisible(false);
          setIsSettingVisible(false);
          setModalClose(true);
          startLocationSync();
        } else if (hasPermission && fullPermission === "foreground-only") {
          setBackgroundDeniedModal(true);
        } else {
          setAlertConfig({
            title: t("title.title13"),
            message: t("title.title15"),
            type: "error",
          });
          setModalClose(false);

          setAlertVisible(true);
          setIsSettingVisible(true);
        }

        isCheckingPermission.current = false;
      };

      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active" && hasLocationField) {
            checkPermissionsOnFocus();
          }
        },
      );

      if (hasLocationField) {
        checkPermissionsOnFocus();
      }

      return () => subscription.remove();
    }, []),
  );

  const route = useRoute<RouteProp<PageRouteParams, "PageScreen">>();
  const { item, title, id, isFromNew, url, pageTitle, isFromProfile }: any =
    route?.params;
  const isFromBusinessCard = route?.params?.isFromBusinessCard || false;

  const validateForm = useCallback(() => {
    setTapLoader(true);
    const validationErrors: Record<string, string> = {};
    const errorMessages: string[] = [];

    controls.forEach((ctrl) => {
      if (ctrl?.mandatory === "1" && !formValues[ctrl?.field]) {
        validationErrors[ctrl.field] = `${ctrl?.fieldtitle || ctrl?.field} ${t(
          "text.text43",
        )}`;
        errorMessages.push(
          `${ctrl?.fieldtitle || ctrl?.field} ${t("text.text43")}`,
        );
      }
    });

    setErrors(validationErrors);
    setErrorsList(errorMessages);
    setTimeout(() => {
      if (errorMessages?.length > 0) setShowErrorModal(true);
    }, 780);

    return errorMessages?.length === 0;
  }, [controls, formValues]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor:
          theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
      },
      headerBackTitle: "",
      headerTintColor: "#fff",
      headerTitle: () => (
        <View
          style={{ flexDirection: "row", alignItems: "center", maxWidth: 210 }}
        >
          <TranslatedText
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontSize: 18,
              fontWeight: "700",
              color: theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_WHITE,
            }}
            text={title || pageTitle || "Details"}
          ></TranslatedText>
          {isFromProfile === false && (
            <TranslatedText
              numberOfLines={1}
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: ERP_COLOR_CODE.ERP_WHITE,
                marginLeft: 4,
              }}
              text={
                isFromNew
                  ? `( ${t("text.text44")} )`
                  : `( ${t("text.text45")} )`
              }
            ></TranslatedText>
          )}
        </View>
      ),
      headerRight: () => (
        <>
          {!error && !isFromNew && (
            <ERPIcon
              name="refresh"
              isLoading={actionLoader}
              onPress={() => {
                setControls([]);
                setFormValues(null);
                setButtonSave(true);
                setActionLoader(true);
                fetchPageData();
                setErrors({});
                setErrorsList([]);
              }}
            />
          )}
          {controls.length > 0 && (
            <ERPIcon
              name="save-as"
              isLoading={actionSaveLoader || tapLoader}
              onPress={async () => {
                try {
                  setTapLoader(true);
                  if (myScript) {
                    let rules;

                    if (typeof myScript === "string") {
                      try {
                        rules = JSON.parse(myScript);
                      } catch (e) {
                        console.error("Invalid JSON from backend", e);
                        setTapLoader(false);
                        return;
                      }
                    } else {
                      rules = myScript;
                    }

                    const { actions, messages } = evaluateRulesWithActions(
                      rules,
                      formValues,
                    );
                    const hasButtonSaveEnable = actions.some(
                      (item) => item?.field === "buttonSave",
                    );
                    if (hasButtonSaveEnable) {
                      const hasButtonSaveEnable = actions.some(
                        (item) =>
                          item?.field === "buttonSave" &&
                          item.action === "enable",
                      );
                      const updatedControls = applyActionsToControls(
                        controls,
                        actions,
                      );
                      setControls(updatedControls);
                      setButtonSave(hasButtonSaveEnable);
                      if (!hasButtonSaveEnable) {
                        setTapLoader(false);
                        setScriptErrorMessage(messages);
                        setIsVisibleScriptError(true);
                        return;
                      }
                    }
                    const updatedControls = applyActionsToControls(
                      controls,
                      actions,
                    );
                    setControls(updatedControls);
                  }

                  const locationEnabled = hasLocationField
                    ? await DeviceInfo.isLocationEnabled()
                    : true;

                  const permissionStatus = hasLocationField
                    ? await requestLocationPermissions()
                    : "granted";

                  const hasCameraPermission = hasMediaField
                    ? await requestCameraPermission()
                    : true;

                  if (!hasCameraPermission && hasMediaField) {
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    setAlertConfig({
                      title: t("title.title16"),
                      message: t("msg.msg15"),
                      type: "error",
                    });

                    return;
                  }

                  if (hasLocationField && !locationEnabled) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    return;
                  }

                  if (
                    hasLocationField &&
                    (permissionStatus === "denied" ||
                      permissionStatus === "blocked")
                  ) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }

                  // ✅ Permissions are granted, proceed
                  setLocationVisible(true);
                  setActionSaveLoader(true);
                  setIsValidate(true);

                  if (validateForm()) {
                    const submitValues: Record<string, any> = {};
                    controls?.forEach((f) => {
                      if (f.refcol !== "1")
                        submitValues[f?.field] = formValues[f?.field];
                    });

                    try {
                      setLoader(true);
                      await dispatch(
                        savePageThunk({
                          page: url,
                          id,
                          data: { ...submitValues },
                        }),
                      ).unwrap();
                      setLoader(false);
                      setIsValidate(false);
                      try {
                        dispatch(getERPAppConfigMenuThunk());
                      } catch (error) {
                        dispatch(updateAppMenuList([])); // Clear menu on error
                        console.log("Error fetching app config menu:", error);
                      }
                      if (isFromProfile) {
                        setTimeout(() => {
                          dispatch(setReloadApp());
                        }, 1000);
                      }
                      fetchPageData();
                      setAlertConfig({
                        title: t("title.title17"),
                        message: t("title.title18"),
                        type: "success",
                      });
                      setAlertVisible(true);
                      setGoBack(true);

                      setTimeout(() => {
                        setAlertVisible(false);
                        navigation.goBack();
                      }, 1800);
                    } catch (err: any) {
                      setLoader(false);
                      setAlertConfig({
                        title: t("title.title17"),
                        message: err,
                        type: "error",
                      });
                      setAlertVisible(true);
                      setGoBack(false);
                    }
                  }

                  setActionSaveLoader(false);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                } catch (error) {
                  console.error("Save error:", error);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                  setActionSaveLoader(false);
                }
              }}
            />
          )}
        </>
      ),
    });
  }, [
    tapLoader,
    navigation,
    item?.name,
    id,
    controls,
    formValues,
    validateForm,
    goBack,
    alertVisible,
    loader,
    actionLoader,
    actionSaveLoader,
    buttonSave,
    error,
  ]);

  const parseBackendScript = (str) => {
    if (!str) return [];

    try {
      let cleaned = str.replace(/\n/g, "");
      cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
      return new Function(`return ${cleaned}`)();
    } catch (e) {
      console.log("❌ Parsing failed:", e);
      return [];
    }
  };

  const fetchPageData = useCallback(async () => {
    try {
      setError(null);
      setLoadingPageId(isFromNew ? "0" : id);
      const parsed = await dispatch(
        getERPPageThunk({ page: url, id: isFromNew ? 0 : id }),
      ).unwrap();
      console.log("script---++++++------------------++++++++++---", parsed);
      if (parsed?.script) {
        console.log("script---++++++++++++++++---", parsed?.script);
        setMyScript(parsed?.script);
      }

      if (!isFromNew) {
        setInfoData({
          id: id?.toString(),
          tableName: parsed?.table,
          title: parsed?.title,
        });
      }

      const pageControls = Array.isArray(parsed?.pagectl)
        ? parsed?.pagectl
        : [];
      const normalizedControls = pageControls?.map((c) => ({
        ...c,
        disabled: String(c?.disabled ?? "0"),
        visible: String(c?.visible ?? "1"),
        mandatory: String(c?.mandatory ?? "0"),
      }));

      setControls(normalizedControls);

      setFormValues((prev) => {
        const merged: any = { ...prev };
        normalizedControls.forEach((c) => {
          if (merged[c?.field] === undefined) {
            merged[c?.field] = c?.text ?? "";
          }
        });
        return merged;
      });
    } catch (e: any) {
      setError(JSON.stringify(e?.data) || "Failed to load page");
    } finally {
      setLoadingPageId(null);
      setTimeout(() => {
        setActionLoader(false);
      }, 10);
    }
  }, [dispatch, id, url]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleAttachment = (base64: string, val: any) => {
    console.log("base64", base64);
    setFormValues((prev) => {
      return { ...prev, [val]: base64 };
    });
  };

  const handleSignatureAttachment = (base64: string, val: any) => {
    setFormValues((prev) => {
      return { ...prev, [val]: base64 };
    });
  };

  const showDateTimePicker = (field: string, date: any) => {
    setActiveDateTimeField(field);
    setActiveDateTime(date);
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
    setActiveDateTimeField(null);
  };

  const handleDateTimeConfirm = (date: Date) => {
    if (activeDateTimeField) {
      setFormValues((prev) => ({
        ...prev,
        [activeDateTimeField]: date.toISOString(),
      }));
    }
    hideDateTimePicker();
  };

  const safeParse = (data) => {
    if (!data) return [];

    if (typeof data === "object") return data; // already parsed ✅

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log("❌ Invalid JSON:", data);
        return [];
      }
    }

    return [];
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const setValue = (val) => {
        console.log("SET VALUE START 👉", item?.field, val);

        setFormValues((prev) => {
          let updatedValues;

          if (typeof val === "object" && val !== null) {
            updatedValues = { ...prev, ...val };
          } else {
            updatedValues = { ...prev, [item.field]: val };
          }

          console.log(
            "Updated Values (before rules):",
            myScript,
            typeof myScript,
          );
          const parsed = safeParse(myScript);
          console.log("parsed-----------------", parsed);

          const safeRules = Array.isArray(parsed) ? parsed : [parsed];

          console.log("safeRules-----------------", safeRules);
          const result = runDynamicRules(safeRules, updatedValues, item.field);

          console.log("After Rules Values 👉", result.values);
          console.log("Actions 👉", result.actions);
          console.log("Messages 👉", result.messages);

          let finalValues = { ...result.values };

          result.actions.forEach((action) => {
            if (action?.action === "setValue" && action?.field) {
              finalValues[action.field] = action.value ?? "";
              console.log(`📝 setValue → ${action.field} = ${action.value}`);
            }
          });

          //   ===
          // 4️⃣ UPDATE CONTROLS
          //   ===
          if (result.actions?.length) {
            const updatedControls = applyActionsToControls(
              controls,
              result.actions,
            );
            setControls(updatedControls);
          }

          //   ===
          // 5️⃣ CLEAR ERROR
          //   ===
          setErrors((prevErr) => ({
            ...prevErr,
            [item.field]: "",
          }));

          console.log("FINAL VALUES ✅", finalValues);
          console.log("SET VALUE END  ==");

          return finalValues;
        });
      };

      const value =
        formValues[item?.field] === "#location"
          ? ""
          : formValues[item?.field] || formValues[item?.text] || "";

          console.log("item 0000000 ", item)
      if (item?.visible === "1") return null;

      let content = null;
      //BoolInput
      if (item?.ctltype === "BOOL") {
        const rawVal = formValues[item?.field] ?? item?.text;
        const boolVal = String(rawVal).toLowerCase() === "true";
        content = (
          <BoolInput
            label={item?.fieldtitle}
            value={boolVal}
            onChange={(val) => {
              setValue({ [item?.field]: val });
            }}
          />
        );
      }
      //----PENDING----CustomMultiPicker
      else if (item?.field === "---") {
        content = (
          <CustomMultiPicker
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      }
      //FilePickerRow
      else if (item?.ctltype === "FILE") {
        content = (
          <FilePickerRow
            isValidate={isValidate}
            baseLink={baseLink}
            infoData={infoData}
            item={item}
            handleAttachment={handleAttachment}
            errors={errors}
          />
        );
      }
      //VideoRecorder
      else if (item?.ctltype === "VIDEO") {
        content = <VideoRecorder item={item} />;
      }
      //ScanScreen
      else if (item?.ctltype === "QRSCANNER" && item?.title === "QR Scan") {
        content = <ScanScreen item={item} />;
      }
      //BarCodeScan
      else if (
        item?.ctltype === "QRSCANNER" &&
        item?.title === "Barcode Scan"
      ) {
        content = <BarCodeScan item={item} />;
      }
      //LocationRow
      else if (item?.defaultvalue === "#location") {
        content = (
          <LocationRow
            locationVisible={locationVisible}
            isValidate={isValidate}
            locationEnabled={locationEnabled}
            item={item}
            setValue={setValue}
          />
        );
      }
      //HtmlRow
      else if (item?.defaultvalue === "#html") {
        content = (
          <View>
            <HtmlRow item={item} isFromPage={true} />
          </View>
        );
      }
      //SignaturePad
      else if (item?.ctltype === "IMAGE" && item?.field === "signature") {
        content = (
          <SignaturePad
            isValidate={isValidate}
            infoData={infoData}
            item={item}
            handleSignatureAttachment={handleSignatureAttachment}
          />
        );
      }
      //Media - BusinessCardView
      else if (
        item?.ctltype === "FILE" ||
        item?.ctltype === "IMAGE" ||
        item?.ctltype === "PHOTO"
      ) {
        content = (
          <>
            {isFromBusinessCard ? (
              <BusinessCardView
                baseLink={baseLink}
                infoData={infoData}
                setValue={setValue}
                controls={controls}
                item={item}
              />
            ) : (
              <Media
                isValidate={isValidate}
                baseLink={baseLink}
                infoData={infoData}
                item={item}
                isFromNew={isFromNew}
                handleAttachment={handleAttachment}
                errors={errors}
              />
            )}
          </>
        );
      }
      //Disabled
      else if (item?.disabled === "1" && item?.ajax !== 1) {
        content = <Disabled item={item} value={value} type={item?.ctltype} />;
      }
      //CustomPicker
      else if (item?.ddl && item?.ddl !== "" && item?.ajax === 0) {
        content = (
          <CustomPicker
            isForceOpen={true}
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      }
      //AjaxPicker
      else if (item?.ddl && item?.ddl !== "" && item?.ajax === 1) {
        content = (
          <AjaxPicker
            isForceOpen={true}
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
            formValues={formValues}
          />
        );
      }
      //DATE
      else if (item?.ctltype === "DATE") {
        content = (
          <DateRow
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDatePicker={showDatePicker}
            // setValue={setValue}
          />
        );
      }
      //DATETIME
      else if (item?.ctltype === "DATETIME") {
        content = (
          <DateTimeRow
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDateTimePicker={showDateTimePicker}
          />
        );
      }
      //Input
      else {
        content = (
          <Input
            id={item?.fieldtitle}
            isValidate={isValidate}
            onFocus={() =>
              flatListRef.current?.scrollToIndex({ index, animated: true })
            }
            item={item}
            errors={errors}
            value={value}
            setValue={setValue}
          />
        );
      }
      //content
      return (
        <Animated.View
          entering={FadeInUp.delay(index * 70).springify()}
          layout={Layout.springify()}
          style={
            isLandscape && {
              width: "100%",
              flex: 1,
              marginRight: 8,
            }
          }
        >
          {content}
        </Animated.View>
      );
    },
    [formValues, errors, controls, locationEnabled, isLandscape],
  );

  const showDatePicker = (field: string, date: any) => {
    setActiveDateField(field);
    setActiveDate(date);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setActiveDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (!activeDateField) return;
    try {
      if (myScript) {
      setFormValues((prev) => {
        const updatedValues = {
          ...prev,
          [activeDateField]: date.toISOString(),
        };

        const parsed = safeParse(myScript);
        console.log("parsed", parsed)

        const safeRules = Array.isArray(parsed) ? parsed : [parsed];
        console.log("safeRules", safeRules, activeDateField)

        // const result = runDynamicRules(
        //   safeRules,
        //   updatedValues,
        //   item.field
        // );

        const result = runDynamicRules(
          safeRules,
          updatedValues,
          activeDateField,
        );

        console.log("result", result)

        return result.values;
      });

      hideDatePicker();
    } else {
      if (activeDateField) {
        setFormValues((prev) => ({
          ...prev,
          [activeDateField]: date.toISOString(),
        }));
      }
      hideDatePicker();
    }
    } catch (error) {
      console.log("error handleConfirm", error)
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (loadingPageId) {
    return <FullViewLoader isShowTop={theme === "dark" ? false : true} />;
  }
  return (
    <>
      {theme !== "dark" && (
        <View
          style={{
            height: Platform.OS === "ios" ? 16 : 6,
            width: "100%",
            backgroundColor:
              theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        ></View>
      )}
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor:
            theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
        }}
      >
        {loadingPageId ? (
          <FullViewLoader />
        ) : !!error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor:
                theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
            }}
          >
            <ErrorMessage message={error} isShowTop={false} />
          </View>
        ) : controls?.length > 0 ? (
          <>
            <View
              style={{
                flex: 1,
                height: Dimensions.get("screen").height,
                backgroundColor:
                  theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={controls}
                key={
                  isLandscape
                    ? `${isLandscape}-landscape`
                    : `${isLandscape}-portrait`
                }
                ref={flatListRef}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: keyboardHeight }}
                keyboardShouldPersistTaps="handled"
                numColumns={isLandscape ? 2 : 1}
              />
            </View>
            <CustomAlert
              visible={alertVisible}
              title={alertConfig.title}
              message={alertConfig.message}
              type={alertConfig.type}
              onClose={() => {
                setTapLoader(false);
                if (modalClose) setAlertVisible(false);
              }}
              actionLoader={undefined}
              isSettingVisible={isSettingVisible}
              closeHide={undefined}
            />
            {loader && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                <FullViewLoader />
              </View>
            )}
          </>
        ) : (
          <View
            style={[
              { flex: 1 },
              theme === "dark" && {
                backgroundColor: "black",
                width: "100%",
              },
            ]}
          >
            <NoData isShowTop={false} />
          </View>
        )}

        <ErrorModal
          visible={isVisibleScriptError}
          errors={scriptErrorMessage}
          onClose={() => {
            setTapLoader(false);
            setIsVisibleScriptError(false);
          }}
        />
        <ErrorModal
          visible={showErrorModal}
          errors={errorsList}
          onClose={() => {
            setTapLoader(false);
            setShowErrorModal(false);
          }}
        />

        {dateTimePickerVisible && Platform.OS === "ios" && (
          <DateTimePicker
            isVisible={dateTimePickerVisible}
            mode="datetime"
            display="spinner"
            is24Hour={false}
            date={
              activeDateTime ? parseCustomDatePage(activeDateTime) : new Date()
            }
            onConfirm={handleDateTimeConfirm}
            onCancel={hideDateTimePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {datePickerVisible && Platform.OS === "ios" && (
          <DateTimePicker
            isVisible={datePickerVisible}
            mode="date"
            date={activeDate ? parseCustomDatePage(activeDate) : new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            display="spinner"
            is24Hour={false}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {Platform.OS !== "ios" && (
          <DateTimePicker
            isVisible={dateTimePickerVisible}
            mode="datetime"
            display="spinner"
            is24Hour={false}
            date={
              activeDateTime ? parseCustomDatePage(activeDateTime) : new Date()
            }
            onConfirm={handleDateTimeConfirm}
            onCancel={hideDateTimePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {Platform.OS !== "ios" && (
          <DateTimePicker
            isVisible={datePickerVisible}
            mode="date"
            display="spinner"
            is24Hour={false}
            date={activeDate ? parseCustomDatePage(activeDate) : new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => {
            setTapLoader(false);
            setAlertVisible(false);
            if (goBack) {
              navigation.goBack();
            }
          }}
          actionLoader={undefined}
          closeHide={undefined}
        />
      </View>
    </>
  );
};

export default PageScreen;






(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
// DevERP

// Multiple build creation with different Name + icon + package name

// --- android build ----
// gradlew --stop
// gradlew clean
// gradlew generateCodegenArtifactsFromSchema 
// gradlew app:assembleRelease 
// cmd - gradlew assemble[BRAND_NAME]Release

// How to used - .env.clientA and .env.cientB ??

// How to run - clientA and clientB app ??
// gradlew installClientADebug -Pbrand=[BRAND_NAME]


Payroll Mobile App – API Documentation

1. Authentication Flow

Step 1: getLink
curl --location 'https://support.deverp.net/devws/appcode.aspx/getLink' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=hg4u3v1lqcd000cgwcp35vyx' \
--data '{
    "code": "payroll"
}'

[ step 2. setAppID: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/setAppID' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "user": "suresh",
    "pass": "suresh",
    "appid": "appid",
    "firebaseid" : "firebaseid",
    "device": "device"
}'

[ step 3. getAuth: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAuth' \
--header 'Content-Type: text/plain' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "appid":"",
    "device": ""
}'

[ step 4. getMenu: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getMenu' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 5. getDB: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDB' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 6. getPage ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getPage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst"
}'

[ step 7. getListData ----]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getListData' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst", "fd":"01-Apr-2024","td":"31-Aug-2025"
}'


[ Attandanced - punch in]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhin",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"InDate\":\"\",\"InImage\":\"\",\"InRemarks\":\"\",\"InLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}
'

[ Attandanced - punch out]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhout",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"OutDate\":\"\",\"OutImage\":\"\",\"OutRemarks\":\"\",\"OutLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}
'

[ get Drop-down ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDDL' \
--header 'Content-Type: application/json' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "dtlid":"1081",
     "where": "PropTypeName=~Gender~"
}'

[ get Ajax ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAjax' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=yuhpy41xwsqjq2olhay4i3c0' \
--data '{
     "token": "d78134973d9b4697a2b3d5b8b2e87510",
     "dtlid":"1072",
     "where":"Status=~A~",
     "search": "dadfdfdfdd"
 }'

[ save page ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": 
"{\"EMPID\":\"1\",\"EMPCode\":\"00001\",\"CardNo\":\"\",\"BranchID\":\"1\",\"DepartmentID\":\"2\",\"DesignationID\":\"1\",\"JoinDate\":\"1/1/2025 12:00:00 AM\",\"Title\":\"Mr\",\"FirstName\":\"Satishvvbnnnnhn\",\"MiddleName\":\"Kalpeshbhai\",\"LastName\":\"Prajapati\",\"BirthDate\":\"1/1/1980 12:00:00 AM\",\"Gender\":\"M\",\"Religion\":\"Hindu\",\"BloodGroup\":\"AB-\",\"MobileNo\":\"87410256394\",\"MobileNo2\":\"\",\"PhoneNo\":\"9905012345\",\"EmailID\":\"satishk@gmail.com\",\"EmailID2\":\"satish@gmail.com\",\"EmergencyContactNo\":\"0533123456\",\"WebSite\":\"https://dev.com\",\"Disabilities\":\"51\",\"DisabilitiesRemarks\":\"\",\"LinkedIn\":\"satish.linkedin\",\"Facebook\":\"satish80\",\"Twitter\":\"satish1980\",\"Instagram\":\"satish80\",\"GitHub\":\"satishgit80\",\"CurrentAddress\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CurrentCityID\":\"48428\",\"CurrentDistrict\":\"AHMEDABAD\",\"CurrentState\":\"GUJARAT\",\"CurrentCountry\":\"INDIA\",\"CurrentPin\":\"380054\",\"Address\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CityID\":\"48428\",\"District\":\"AHMEDABAD\",\"State\":\"GUJARAT\",\"Country\":\"INDIA\",\"Pin\":\"380054\",\"AdharNo\":\"854172653987\",\"PANNo\":\"HGTUG5417H\",\"BankName\":\"HDFC Bank\",\"ACNo\":\"87456125367\",\"IFSCCode\":\"HDFC102310\",\"NameInBankAccount\":\"SATISH KALPESHBHAI PRAJAPATI\",\"PFNo\":\"PFSATISH\",\"ESINo\":\"ESICSATISH\",\"GratutityFormNo\":\"GT123456\",\"Status\":\"A\",\"ResignDate\":\"\",\"ResignReason\":\"\",\"Remarks\":\"\",\"LastDate\":\"\",\"UserID\":\"0\",\"CUID\":\"1\",\"Image\":\"d_logo.png\",\"CDT\":\"1/18/2025 12:00:00 AM\",\"MUID\":\"6\",\"MDT\":\"27-Aug-2025 13:22:37\"}",
 "page": "EmployeeMaster",
"token": "8c4aaf0e74fd4338943162b3876b2c7d"
}'


[ Delete ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDelete' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remark":"1=1",
     "page": "EmployeeMaster"
}'

[ Auth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ DeAuth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDeAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ Cancel ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageCancel' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'

[ getLastPunchIn ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getLastPunchIn' \
--header 'Content-Type: application/json' \
--data '{
    "token": "49d45d99eff64492b94f449238507c7c"
}'

[ syncLocation ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/syncLocation' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=ibj4tkc5ffzqbyp2xoni4pvt; ASP.NET_SessionId=2vj4yympr4l0kqag3xaxdcul' \
--data '{
    "token":"9eecfb8d7bbf4acba7568f21f078c9f5",
    "location":"45.5556,12.6655"
}'

================================================================================

1) Prerequisites (local)

Java JDK installed (openJDK 11+ recommended), Android SDK + platform tools, Android Studio or at least the Android build tools on PATH.

React Native CLI app (you said you already made a dummy app and not using Expo).

A Google account you’ll use to register as a Play developer.

(If you need help installing Android SDK / JDK I can paste commands — say the OS.)

2) Create a Google Play Developer account (one-time)

Sign up at the Play Console and pay the one-time registration fee (US$25 approx). You’ll also provide developer name and contact info. 
Google Support

Link: use Play Console signup when ready (Play Console help / Get started).

3) Prepare your app for release (source changes)

Bump versionName & versionCode in android/app/build.gradle (defaultConfig):

defaultConfig {
  applicationId "com.yourcompany.yourapp" // must be unique
  minSdkVersion rootProject.ext.minSdkVersion
  targetSdkVersion rootProject.ext.targetSdkVersion
  versionCode 1        // increment this for every upload
  versionName "1.0.0"  // visible to users
}


Always increment versionCode for every new upload. 
Android Developers

Unique applicationId / package name — Play requires each app’s package name be unique (you set this when you created the project). If you ever change it after publishing you’ll create a new app on Play.

Remove debug-only code/configs (dev servers, debug flags) and verify app works in release mode on device/emulator.

4) Create an upload key (keystore) — you control this

You need a keystore (upload key). Keep it and its passwords SAFE and back them up (Play cannot restore lost keystores easily).

Command (run in terminal):

# example — change alias/keystore name and passwords to your own values
keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


This will prompt for passwords and metadata. (Works on macOS / Linux / Windows with Java's keytool available.) 
React Native

Then move the generated my-upload-key.jks into your RN project android/app/ folder (or keep it safe elsewhere — but Gradle config below expects to find or reference it).

5) Configure Gradle so release builds are signed by your upload key

React Native docs recommend storing keystore properties in ~/.gradle/gradle.properties (or android/gradle.properties) and referencing them from android/app/build.gradle.

A. Add these to ~/.gradle/gradle.properties (or android/gradle.properties):

MYAPP_UPLOAD_STORE_FILE=my-upload-key.jks
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password_here


B. Add signing config to android/app/build.gradle (example snippet inside android { ... }):

signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        // Make sure you keep minify / proguard settings as desired
        signingConfig signingConfigs.release
        // minifyEnabled true/false depending on your needs
    }
}


This is the standard RN/Android way to point Gradle at your keystore. React Native docs explain this flow in detail. 
React Native

Important: for security, don’t check your *.jks or passwords into Git — add them to .gitignore and use secure storage/CI secrets.

6) Enroll in Play App Signing (Google Play signing)

For new apps, Play App Signing is mandatory: you upload an upload key (the one you created above) and Google will manage final app signing and distribution keys. Enroll when you create the app or during upload. 
Android Developers
Google Support

(Short version: you keep your upload key safe and upload the AAB signed with that upload key; Google manages the final signing key and distribution.)

7) Build the Android App Bundle (.aab)

Google Play requires/upload prefers AAB (Android App Bundle). From your RN project root:

# macOS / Linux
cd android
./gradlew bundleRelease

# Windows
cd android
gradlew.bat bundleRelease


When the build succeeds the AAB will be at:
android/app/build/outputs/bundle/release/app-release.aab — ready to upload to Play. 
React Native

8) Test the release build

Options:

Use Internal testing or Internal app sharing in Play Console (fastest way to get an installable link to testers). This avoids needing to produce APKs locally — upload the .aab to the internal track and invite testers. 
Google Play
Google Support

(Advanced) Use bundletool to generate device-specific APKs from the AAB and sideload — but internal testing is easier.

9) Create the app in Play Console & upload the AAB

Open Play Console → Create app → choose app name, language, app vs game, paid/free. (You picked up the dev account in step 2.) 
Google Support

Fill App Content (Policy) — privacy policy URL, data safety, target audience, content rating, ads declaration. These must be completed before publishing. 
Google Support
+1

Go to Release > Testing > Internal testing (or select Closed/Open testing or Production) → Create new release → upload the app-release.aab.

Review, save, and Start rollout to the chosen testing track.

Important: For the first upload you’ll be asked to accept Play App Signing if you haven’t already (see step 6). 
Android Developers

10) Store listing assets (required and common requirements)

Prepare and upload the following on the Play Console’s Store Listing page:

App icon (512×512 PNG, max 1MB).

Feature graphic (optional but recommended for promo).

Screenshots: at least 2 phone screenshots (JPEG or 24-bit PNG, no alpha). Google has specific rules: min dimension ~320 px, max 3840 px, aspect ratio constraints, and no extra device frames/text overlays in screenshots. See Play assets guidelines. 
Google Support
sommo.io

Upload clear screenshots that show actual app UI; prepare privacy policy URL and contact email.

11) Publish: internal → closed → production

Start with Internal testing to verify installs on real devices quickly. Once testers confirm, promote to Closed or Open testing, then to Production. Internal tests typically publish fast; production can take longer (hours → few days depending on review). 
Google Play
Google Support

12) After upload: checks & monitoring

Monitor Play Console for pre-launch reports, crash reports, ANRs, and policy issues.

If you push an update later, increment versionCode and build a new AAB (see step 3/7). 
Android Developers

13) Useful commands & troubleshooting tips

Generate keystore (again):

keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


(Store the .jks and passwords safely.) 
React Native

Build AAB:

cd android
./gradlew bundleRelease


Output: android/app/build/outputs/bundle/release/app-release.aab. 
React Native

Check signing fingerprint (SHA-1):

keytool -list -v -keystore my-upload-key.jks -alias my-key-alias


(Needed for some APIs like Google Sign-In.) 
Google for Developers

Common errors

validateSigningRelease FAILED → signing config issue; check keystore path/password/alias and that Gradle properties are correct.

versionCode conflict → increase versionCode.

14) Quick publish checklist (before pressing Release)

 Google Play Developer account active (paid + verified). 
Google Support

 App bundle .aab built and signed with your upload key. 
React Native

 VersionCode incremented. 
Android Developers

 Store listing: title, short description, full description. 
Google Support

 Graphics: 512×512 icon, screenshots (2+), feature graphic if used. 
Google Support

 App content filled: privacy policy URL, data safety, content rating, target audience. 
Google Support
+1

 Enrolled in Play App Signing (new apps). 
Android Developers

Official references (open these while you publish)

React Native — Signed release / Publish to Play (how to create keystore, set gradle variables, build .aab). 
React Native

Android Developers — Upload your app to Play Console (Play App Signing is mandatory for new apps). 
Android Developers

Play Console — Get started with Play Console (developer account & fee). 
Google Support

Google Play — Play App Signing (upload vs app signing keys explanation). 
Google Support

Play Console — Add preview assets / screenshots requirements. 
Google Support

=


================================================
FILE: api_des.md
================================================
📱 Payroll Mobile App – API Documentation

This API enables authentication, menu fetching, attendance (punch-in/out), and CRUD operations for employee and payroll-related modules.

🔑 Step 1. Get Link

Retrieve the target app link from the central service.

Endpoint:

POST https://support.deverp.net/devws/appcode.aspx/getLink


Headers:

Content-Type: application/json


Request Body:

{
  "code": "payroll"
}


Response Example:

{
  "status": "success",
  "link": "https://payroll.deverp.net"
}

👤 Step 2. Set App ID

Authenticate the user and register the device.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/setAppID


Headers:

Content-Type: application/json


Request Body:

{
  "user": "suresh",
  "pass": "suresh",
  "appid": "appid",
  "firebaseid": "firebaseid",
  "device": "device"
}


Response Example:

{
  "status": "success",
  "appid": "generated_app_id",
  "session": "ASP.NET_SessionId=..."
}

🔐 Step 3. Get Auth Token

Obtain a session token for further API access.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getAuth


Headers:

Content-Type: application/json


Request Body:

{
  "appid": "your_appid",
  "device": "your_device"
}


Response Example:

{
  "token": "54da6bd990954c45a729d29210d23114"
}

📋 Step 4. Get Menu

Retrieve available menus for the user.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getMenu


Request Body:

{
  "token": "your_token"
}

🗄 Step 5. Get Database Info

Fetch DB-related details for user.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getDB


Request Body:

{
  "token": "your_token"
}

📑 Step 6. Get Page

Get metadata/schema for a specific page/module.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getPage


Request Body:

{
  "token": "your_token",
  "page": "PropMst"
}

📊 Step 7. Get List Data

Fetch list records between date ranges.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getListData


Request Body:

{
  "token": "your_token",
  "page": "PropMst",
  "fd": "01-Apr-2024",
  "td": "31-Aug-2025"
}

🕒 Attendance – Punch In

Record employee punch-in.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/punhin


Request Body:

{
  "token": "your_token",
  "page": "punhin",
  "data": "{\"EmployeeId\":\"EMP123\",\"InDate\":\"2025-08-28 09:00:00\",\"InImage\":\"base64img\",\"InRemarks\":\"Office entry\",\"InLocation\":{\"lat\":\"23.0225\",\"long\":\"72.5714\"},\"CUID\":\"your_token\"}"
}

🕔 Attendance – Punch Out

Record employee punch-out.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/punhout


Request Body:

{
  "token": "your_token",
  "page": "punhout",
  "data": "{\"EmployeeId\":\"EMP123\",\"OutDate\":\"2025-08-28 18:00:00\",\"OutImage\":\"base64img\",\"OutRemarks\":\"Leaving office\",\"OutLocation\":{\"lat\":\"23.0225\",\"long\":\"72.5714\"},\"CUID\":\"your_token\"}"
}

⬇️ Get Dropdown Data

Fetch dropdown values for forms.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getDDL


Request Body:

{
  "token": "your_token",
  "dtlid": "1081",
  "where": "PropTypeName=~Gender~"
}

🔍 Get Ajax Data

Fetch dynamic lookup/search data.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/getAjax


Request Body:

{
  "token": "your_token",
  "dtlid": "1103",
  "where": "1=1",
  "search": ""
}

💾 Save Page

Save or update employee data.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/savePage


Request Body:

{
  "page": "EmployeeMaster",
  "token": "your_token",
  "data": "{...employee json data...}"
}

🗑 Delete Page Record

Delete a record from a page.

Endpoint:

POST https://payroll.deverp.net/devws/msp_api.aspx/pageDelete


Request Body:

{
  "token": "your_token",
  "id": "00100",
  "remark": "Deleted by admin",
  "page": "EmployeeMaster"
}

✅ Page Authorization

Approve (authorize) a record.

POST /pageAuth


Request Body:

{
  "token": "your_token",
  "id": "00100",
  "remarks": "Approved",
  "page": "EmployeeMaster"
}

❌ Page De-Authorization

Revoke approval.

POST /pageDeAuth

🚫 Page Cancel

Cancel a record.

POST /pageCancel

🔄 API Flow Summary

getLink → fetch app URL

setAppID → authenticate user & device

getAuth → generate session token

getMenu / getDB → fetch menu & DB info

getPage / getListData → load module & records

punhin / punhout → attendance marking

getDDL / getAjax → dropdown & lookup data

savePage / pageDelete / pageAuth / pageDeAuth / pageCancel → CRUD & workflow


================================================
FILE: app.json
================================================
{
  "name": "DevERP",
  "displayName": "DevERP"
}



================================================
FILE: App.tsx
================================================
import React, { useEffect, useState } from 'react';
import { Alert, AppState, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { store } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import NoInternetScreen from './src/screens/noInternet/NoInternet';
import CustomSplashScreen from './src/screens/splash/SplashScreen';
import { TranslationProvider } from './src/components/TranslationProvider';
import { ERP_COLOR_CODE } from './src/utils/constants';
import useNetworkStatus from './src/hooks/useNetworkStatus';

import {
  requestUserPermission,
  onMessageListener,
  setBackgroundMessageHandler,
  onNotificationOpenedAppListener,
  checkInitialNotification,
} from './src/firebase/firebaseService';
import { clearAllTempFiles } from './src/utils/helpers';

const App = () => {
  const isConnected = useNetworkStatus();
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    clearAllTempFiles();
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        clearAllTempFiles(); 
      }
    });

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    requestUserPermission();
    setBackgroundMessageHandler();
    const unsubscribeForeground = onMessageListener(remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'New Message',
        remoteMessage.notification?.body ?? JSON.stringify(remoteMessage.data),
      );
    });

    const unsubscribeBackground = onNotificationOpenedAppListener(remoteMessage => {
      Alert.alert('App opened from background', JSON.stringify(remoteMessage.data));
    });

    checkInitialNotification(remoteMessage => {
      Alert.alert('App opened from quit state', JSON.stringify(remoteMessage.data));
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  if (!isConnected) {
    return (
      <TranslationProvider>
        <StatusBar backgroundColor={ERP_COLOR_CODE.ERP_APP_COLOR} barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR }} />
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
          <NoInternetScreen onRetry={() => {}} />
        </SafeAreaView>
      </TranslationProvider>
    );
  }

  if (isSplashVisible) {
    return (
      <TranslationProvider>
        <StatusBar backgroundColor={ERP_COLOR_CODE.ERP_APP_COLOR} barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR }} />
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
          <CustomSplashScreen onFinish={() => setSplashVisible(false)} />
        </SafeAreaView>
      </TranslationProvider>
    );
  }

  return (
    <TranslationProvider>
      <Provider store={store}>
        <StatusBar backgroundColor={ERP_COLOR_CODE.ERP_APP_COLOR} barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR }} />
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </TranslationProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
});

export default App;



================================================
FILE: babel.config.js
================================================
module.exports = {
  presets: ['module:@react-native/babel-preset'],
    plugins: [
      'react-native-worklets/plugin',
    ],
};



================================================
FILE: firebase.json
================================================
{
  "react-native": {
    "messaging_android_notification_permission": true
  }
}



================================================
FILE: Gemfile
================================================
source 'https://rubygems.org'

# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby ">= 2.6.10"

# Exclude problematic versions of cocoapods and activesupport that causes build failures.
gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj', '< 1.26.0'
gem 'concurrent-ruby', '< 1.3.4'

# Ruby 3.4.0 has removed some libraries from the standard library.
gem 'bigdecimal'
gem 'logger'
gem 'benchmark'
gem 'mutex_m'



================================================
FILE: index.js
================================================
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);



================================================
FILE: jest.config.js
================================================
module.exports = {
  preset: 'react-native',
};



================================================
FILE: metro.config.js
================================================
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);



================================================
FILE: package.json
================================================
{
  "name": "DevERP",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "bundle-android": "cd android && ./gradlew --stop && ./gradlew clean && ./gradlew generateCodegenArtifactsFromSchema && ./gradlew app:bundleRelease",
    "build-android": "cd android && ./gradlew --stop && ./gradlew clean && ./gradlew generateCodegenArtifactsFromSchema && ./gradlew app:assembleRelease"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-native-community/datetimepicker": "^8.4.4",
    "@react-native-community/geolocation": "^3.4.0",
    "@react-native-community/netinfo": "^11.4.1",
    "@react-native-firebase/app": "^23.1.0",
    "@react-native-firebase/messaging": "^23.1.0",
    "@react-native-ml-kit/text-recognition": "^2.0.0",
    "@react-native-vector-icons/material-icons": "^12.3.0",
    "@react-native/new-app-screen": "0.80.2",
    "@react-navigation/bottom-tabs": "^7.4.5",
    "@react-navigation/drawer": "^7.5.6",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/stack": "^7.4.5",
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.11.0",
    "formik": "^2.4.6",
    "i": "^0.3.7",
    "i18next": "^25.3.4",
    "i18next-browser-languagedetector": "^8.2.0",
    "i18next-http-backend": "^3.0.2",
    "moment": "^2.30.1",
    "npm": "^11.6.0",
    "react": "19.1.0",
    "react-i18next": "^15.6.1",
    "react-native": "0.80.2",
    "react-native-calendars": "^1.1313.0",
    "react-native-config": "^1.5.6",
    "react-native-device-info": "^14.0.4",
    "react-native-fast-image": "^8.6.3",
    "react-native-fs": "^2.20.0",
    "react-native-geocoding": "^0.5.0",
    "react-native-gesture-handler": "^2.28.0",
    "react-native-gifted-charts": "^1.4.63",
    "react-native-image-picker": "^8.2.1",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-modal-datetime-picker": "^18.0.0",
    "react-native-permissions": "^5.4.2",
    "react-native-reanimated": "^4.0.1",
    "react-native-render-html": "^6.3.4",
    "react-native-safe-area-context": "^5.5.2",
    "react-native-screens": "^4.13.1",
    "react-native-signature-canvas": "^5.0.1",
    "react-native-sqlite-storage": "^6.0.1",
    "react-native-svg": "^15.12.1",
    "react-native-vector-icons": "^10.3.0",
    "react-native-webview": "^13.15.0",
    "react-native-worklets": "^0.4.1",
    "react-redux": "^9.2.0",
    "redux-persist": "^6.0.0",
    "yup": "^1.7.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/runtime": "^7.25.0",
    "@react-native-community/cli": "19.1.1",
    "@react-native-community/cli-platform-android": "19.1.1",
    "@react-native-community/cli-platform-ios": "19.1.1",
    "@react-native/babel-preset": "0.80.2",
    "@react-native/eslint-config": "0.80.2",
    "@react-native/metro-config": "0.80.2",
    "@react-native/typescript-config": "0.80.2",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.1.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "react-test-renderer": "19.1.0",
    "typescript": "5.0.4"
  },
  "engines": {
    "node": ">=18"
  }
}



================================================
FILE: tsconfig.json
================================================
{
  "extends": "@react-native/typescript-config"
}



================================================
FILE: __tests__/App.test.tsx
================================================
/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});



================================================
FILE: android/gradle.properties
================================================
# Project-wide Gradle settings.

# IDE (e.g. Android Studio) users:
# Gradle settings configured through the IDE *will override*
# any settings specified in this file.

# For more details on how to configure your build environment visit
# http://www.gradle.org/docs/current/userguide/build_environment.html

# Specifies the JVM arguments used for the daemon process.
# The setting is particularly useful for tweaking memory settings.
# Default value: -Xmx512m -XX:MaxMetaspaceSize=256m
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m

# When configured, Gradle will run in incubating parallel mode.
# This option should only be used with decoupled projects. More details, visit
# http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects
# org.gradle.parallel=true

# AndroidX package structure to make it clearer which packages are bundled with the
# Android operating system, and which are packaged with your app's APK
# https://developer.android.com/topic/libraries/support-library/androidx-rn
android.useAndroidX=true

# Use this property to specify which architecture you want to build.
# You can also override it from the CLI using
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# Use this property to enable support to the new architecture.
# This will allow you to use TurboModules and the Fabric render in
# your application. You should enable this flag either if you want
# to write custom TurboModules/Fabric components OR use libraries that
# are providing them.
newArchEnabled=true

# Use this property to enable or disable the Hermes JS engine.
# If set to false, you will be using JSC instead.
hermesEnabled=true
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=deverp
MYAPP_RELEASE_KEY_PASSWORD=deverp



================================================
FILE: android/gradlew
================================================
#!/bin/sh

#
# Copyright © 2015-2021 the original authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
#

##############################################################################
#
#   Gradle start up script for POSIX generated by Gradle.
#
#   Important for running:
#
#   (1) You need a POSIX-compliant shell to run this script. If your /bin/sh is
#       noncompliant, but you have some other compliant shell such as ksh or
#       bash, then to run this script, type that shell name before the whole
#       command line, like:
#
#           ksh Gradle
#
#       Busybox and similar reduced shells will NOT work, because this script
#       requires all of these POSIX shell features:
#         * functions;
#         * expansions «$var», «${var}», «${var:-default}», «${var+SET}»,
#           «${var#prefix}», «${var%suffix}», and «$( cmd )»;
#         * compound commands having a testable exit status, especially «case»;
#         * various built-in commands including «command», «set», and «ulimit».
#
#   Important for patching:
#
#   (2) This script targets any POSIX shell, so it avoids extensions provided
#       by Bash, Ksh, etc; in particular arrays are avoided.
#
#       The "traditional" practice of packing multiple parameters into a
#       space-separated string is a well documented source of bugs and security
#       problems, so this is (mostly) avoided, by progressively accumulating
#       options in "$@", and eventually passing that to Java.
#
#       Where the inherited environment variables (DEFAULT_JVM_OPTS, JAVA_OPTS,
#       and GRADLE_OPTS) rely on word-splitting, this is performed explicitly;
#       see the in-line comments for details.
#
#       There are tweaks for specific operating systems such as AIX, CygWin,
#       Darwin, MinGW, and NonStop.
#
#   (3) This script is generated from the Groovy template
#       https://github.com/gradle/gradle/blob/HEAD/platforms/jvm/plugins-application/src/main/resources/org/gradle/api/internal/plugins/unixStartScript.txt
#       within the Gradle project.
#
#       You can find Gradle at https://github.com/gradle/gradle/.
#
##############################################################################

# Attempt to set APP_HOME

# Resolve links: $0 may be a link
app_path=$0

# Need this for daisy-chained symlinks.
while
    APP_HOME=${app_path%"${app_path##*/}"}  # leaves a trailing /; empty if no leading path
    [ -h "$app_path" ]
do
    ls=$( ls -ld "$app_path" )
    link=${ls#*' -> '}
    case $link in             #(
      /*)   app_path=$link ;; #(
      *)    app_path=$APP_HOME$link ;;
    esac
done

# This is normally unused
# shellcheck disable=SC2034
APP_BASE_NAME=${0##*/}
# Discard cd standard output in case $CDPATH is set (https://github.com/gradle/gradle/issues/25036)
APP_HOME=$( cd -P "${APP_HOME:-./}" > /dev/null && printf '%s\n' "$PWD" ) || exit

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD=maximum

warn () {
    echo "$*"
} >&2

die () {
    echo
    echo "$*"
    echo
    exit 1
} >&2

# OS specific support (must be 'true' or 'false').
cygwin=false
msys=false
darwin=false
nonstop=false
case "$( uname )" in                #(
  CYGWIN* )         cygwin=true  ;; #(
  Darwin* )         darwin=true  ;; #(
  MSYS* | MINGW* )  msys=true    ;; #(
  NONSTOP* )        nonstop=true ;;
esac

CLASSPATH="\\\"\\\""


# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        # IBM's JDK on AIX uses strange locations for the executables
        JAVACMD=$JAVA_HOME/jre/sh/java
    else
        JAVACMD=$JAVA_HOME/bin/java
    fi
    if [ ! -x "$JAVACMD" ] ; then
        die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
else
    JAVACMD=java
    if ! command -v java >/dev/null 2>&1
    then
        die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
fi

# Increase the maximum file descriptors if we can.
if ! "$cygwin" && ! "$darwin" && ! "$nonstop" ; then
    case $MAX_FD in #(
      max*)
        # In POSIX sh, ulimit -H is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        MAX_FD=$( ulimit -H -n ) ||
            warn "Could not query maximum file descriptor limit"
    esac
    case $MAX_FD in  #(
      '' | soft) :;; #(
      *)
        # In POSIX sh, ulimit -n is undefined. That's why the result is checked to see if it worked.
        # shellcheck disable=SC2039,SC3045
        ulimit -n "$MAX_FD" ||
            warn "Could not set maximum file descriptor limit to $MAX_FD"
    esac
fi

# Collect all arguments for the java command, stacking in reverse order:
#   * args from the command line
#   * the main class name
#   * -classpath
#   * -D...appname settings
#   * --module-path (only if needed)
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, and GRADLE_OPTS environment variables.

# For Cygwin or MSYS, switch paths to Windows format before running java
if "$cygwin" || "$msys" ; then
    APP_HOME=$( cygpath --path --mixed "$APP_HOME" )
    CLASSPATH=$( cygpath --path --mixed "$CLASSPATH" )

    JAVACMD=$( cygpath --unix "$JAVACMD" )

    # Now convert the arguments - kludge to limit ourselves to /bin/sh
    for arg do
        if
            case $arg in                                #(
              -*)   false ;;                            # don't mess with options #(
              /?*)  t=${arg#/} t=/${t%%/*}              # looks like a POSIX filepath
                    [ -e "$t" ] ;;                      #(
              *)    false ;;
            esac
        then
            arg=$( cygpath --path --ignore --mixed "$arg" )
        fi
        # Roll the args list around exactly as many times as the number of
        # args, so each arg winds up back in the position where it started, but
        # possibly modified.
        #
        # NB: a `for` loop captures its iteration list before it begins, so
        # changing the positional parameters here affects neither the number of
        # iterations, nor the values presented in `arg`.
        shift                   # remove old arg
        set -- "$@" "$arg"      # push replacement arg
    done
fi


# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# Collect all arguments for the java command:
#   * DEFAULT_JVM_OPTS, JAVA_OPTS, and optsEnvironmentVar are not allowed to contain shell fragments,
#     and any embedded shellness will be escaped.
#   * For example: A user cannot expect ${Hostname} to be expanded, as it is an environment variable and will be
#     treated as '${Hostname}' itself on the command line.

set -- \
        "-Dorg.gradle.appname=$APP_BASE_NAME" \
        -classpath "$CLASSPATH" \
        -jar "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" \
        "$@"

# Stop when "xargs" is not available.
if ! command -v xargs >/dev/null 2>&1
then
    die "xargs is not available"
fi

# Use "xargs" to parse quoted args.
#
# With -n1 it outputs one arg per line, with the quotes and backslashes removed.
#
# In Bash we could simply go:
#
#   readarray ARGS < <( xargs -n1 <<<"$var" ) &&
#   set -- "${ARGS[@]}" "$@"
#
# but POSIX shell has neither arrays nor command substitution, so instead we
# post-process each arg (as a line of input to sed) to backslash-escape any
# character that might be a shell metacharacter, then use eval to reverse
# that process (while maintaining the separation between arguments), and wrap
# the whole thing up as a single "set" statement.
#
# This will of course break if any of these variables contains a newline or
# an unmatched quote.
#

eval "set -- $(
        printf '%s\n' "$DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS" |
        xargs -n1 |
        sed ' s~[^-[:alnum:]+,./:=@_]~\\&~g; ' |
        tr '\n' ' '
    )" '"$@"'

exec "$JAVACMD" "$@"



================================================
FILE: android/gradlew.bat
================================================
@REM Copyright (c) Meta Platforms, Inc. and affiliates.
@REM
@REM This source code is licensed under the MIT license found in the
@REM LICENSE file in the root directory of this source tree.

@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem
@rem SPDX-License-Identifier: Apache-2.0
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=


@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" -jar "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%GRADLE_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega



================================================
FILE: android/app/google-services.json
================================================
{
  "project_info": {
    "project_number": "944238529141",
    "project_id": "deverp-main",
    "storage_bucket": "deverp-main.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:944238529141:android:12a6f618e39c784910463c",
        "android_client_info": {
          "package_name": "com.deverp"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyBGDItQguYZy-Cz4iEvLahkZPrhqQimsok"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}


================================================
FILE: android/app/proguard-rules.pro
================================================
# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:



================================================
FILE: android/app/src/debug/AndroidManifest.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:usesCleartextTraffic="true"
        tools:targetApi="28"
        tools:ignore="GoogleAppIndexingWarning"/>
</manifest>



================================================
FILE: android/app/src/main/AndroidManifest.xml
================================================
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

  <!-- Permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <!-- Android 10+ background location -->
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="true"
      android:supportsRtl="true">

      <!-- <meta-data
          android:name="com.google.firebase.messaging.default_notification_channel_id"
          android:value="default" /> -->
      <!-- Foreground service declaration -->
        <service
          android:name=".location.LocationService"
          android:foregroundServiceType="location"
          android:exported="false" />

      <!-- Boot receiver to restart service after reboot -->
        <receiver
          android:name=".location.BootReceiver"
          android:enabled="true"
          android:exported="false">
          <intent-filter>
            <action android:name="android.intent.action.BOOT_COMPLETED" />
            <action android:name="android.intent.action.LOCKED_BOOT_COMPLETED" />
            <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
          </intent-filter>
        </receiver>
    

      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>



================================================
FILE: android/app/src/main/java/com/deverp/MainActivity.kt
================================================
package com.deverp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "DevERP"
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}



================================================
FILE: android/app/src/main/java/com/deverp/MainApplication.kt
================================================
package com.deverp
import com.deverp.location.LocationPackage 
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.deverp.battery.BatteryOptimizationPackage;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
                   add(LocationPackage())
                   add(BatteryOptimizationPackage())

        }
        override fun getJSMainModuleName(): String = "index"
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}



================================================
FILE: android/app/src/main/java/com/deverp/battery/BatteryOptimizationModule.kt
================================================
package com.deverp.battery

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BatteryOptimizationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BatteryOptimization"
    }

    @ReactMethod
    fun isIgnoringBatteryOptimizations(promise: Promise) {
        try {
            val pm = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
            val isIgnoring = pm.isIgnoringBatteryOptimizations(reactContext.packageName)
            promise.resolve(isIgnoring)
        } catch (e: Exception) {
            promise.reject("ERR_OPT_CHECK", e)
        }
    }

   @ReactMethod
fun requestIgnoreBatteryOptimizations(promise: Promise) {
    try {
        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = Uri.parse("package:${reactContext.packageName}")
        }

        val activity = currentActivity
        if (activity != null) {
            activity.startActivity(intent)
            promise.resolve(true)
        } else {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
            promise.resolve(true)
        }
    } catch (e: Exception) {
        promise.reject("ERR_OPT_REQUEST", e)
    }
}

}



================================================
FILE: android/app/src/main/java/com/deverp/battery/BatteryOptimizationPackage.kt
================================================
package com.deverp.battery

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BatteryOptimizationPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(BatteryOptimizationModule(reactContext))
    }
}



================================================
FILE: android/app/src/main/java/com/deverp/location/BootReceiver.kt
================================================
package com.deverp.location

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d("BootReceiver", "Device rebooted, restarting LocationService")
            val serviceIntent = Intent(context, LocationService::class.java)
            context.startForegroundService(serviceIntent)
        }
    }
}



================================================
FILE: android/app/src/main/java/com/deverp/location/LocationModule.kt
================================================
package com.deverp.location

import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log
import com.deverp.location.LocationService
import com.facebook.react.bridge.ReadableArray
import com.deverp.location.UserData


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
}



================================================
FILE: android/app/src/main/java/com/deverp/location/LocationPackage.kt
================================================
package com.deverp.location

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class LocationPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(LocationModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}



================================================
FILE: android/app/src/main/java/com/deverp/location/LocationService.kt
================================================
package com.deverp.location

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import java.net.HttpURLConnection
import java.net.URL
import com.deverp.location.UserData

// --- Model class for token + link ---
 
class LocationService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private var lastLocation: Location? = null
    private val handler = Handler()

    companion object {
        // Store list of token-link pairs
        var userDataList: MutableList<UserData> = mutableListOf()
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        startForeground(1, createNotification())

        startLocationUpdates()
        startRepeatingSync()

        val filter = IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION)
        registerReceiver(locationReceiver, filter)
    }

    private val locationReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (isLocationEnabled(context)) {
                Log.d("LocationService", "Location enabled by user, restarting updates")
                startLocationUpdates()
            } else {
                Log.w("LocationService", "Location disabled by user")
                sendDisabledToApi()
                fusedLocationClient.removeLocationUpdates(locationCallback)
                notifyLocationDisabled()
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("LocationService", "Service started/restarted")
        return START_STICKY
    }

    fun isLocationEnabled(context: Context): Boolean {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
            locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }

    private fun createNotification(): Notification {
        val channelId = "location_service_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Location Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("ERP Location Tracking")
            .setContentText("Your location is being tracked in background")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    private fun startLocationUpdates() {
        if (!isLocationEnabled(this)) {
            Log.w("LocationService", "🚀 Location is disabled by user")
            notifyLocationDisabled()
            return
        }

        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            1000
        ).setMinUpdateDistanceMeters(0f)
            .build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                super.onLocationResult(locationResult)
                if (locationResult.locations.isNotEmpty()) {
                    lastLocation = locationResult.locations.last()
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            request,
            locationCallback,
            mainLooper
        )
    }

    private fun notifyLocationDisabled() {
        val channelId = "location_service_channel"
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Enable Location")
            .setContentText("Please enable location services to use this app.")
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setOngoing(false)
            .build()

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(2, notification)
    }

    private var hasSentDisabled = false

    private fun startRepeatingSync() {
        val runnable = object : Runnable {
            override fun run() {
                if (!isLocationEnabled(this@LocationService)) {
                    fusedLocationClient.removeLocationUpdates(locationCallback)
                    if (!hasSentDisabled) {
                        sendDisabledToApi()
                        hasSentDisabled = true
                    }
                    notifyLocationDisabled()
                } else {
                    hasSentDisabled = false
                    lastLocation?.let { handleNewLocation(it) }
                }
                handler.postDelayed(this, 30_000)
            }
        }
        handler.post(runnable)
    }

    private fun sendDisabledToApi() {
        for (user in userDataList) {
            Thread {
                try {
                    val url = URL(user.link + "/msp_api.aspx/syncLocation")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json")

                    val json = """
                        {
                        "token": "${user.token}",
                        "location": "disabled"
                        }
                    """.trimIndent()

                    conn.outputStream.use { it.write(json.toByteArray()) }
                    val response = conn.inputStream.bufferedReader().readText()
                    Log.d("LocationService", "⚠️ API Response for disabled ${user.token}: $response")
                } catch (e: Exception) {
                    Log.e("LocationService", "❌ Failed to send disabled for ${user.token}", e)
                }
            }.start()
        }
    }

    private fun handleNewLocation(location: Location) {
        Log.d("LocationService", "📍 New location: ${location.latitude}, ${location.longitude}")

        if (userDataList.isEmpty()) {
            Log.w("LocationService", "⚠️ No user data available, skipping API call")
            return
        }

        for (user in userDataList) {
            Thread {
                try {
                    val url = URL(user.link + "/msp_api.aspx/syncLocation")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json")

                    val json = """
                        {
                        "token": "${user.token}",
                        "location": "${location.latitude},${location.longitude}"
                        }
                    """.trimIndent()

                    conn.outputStream.use { it.write(json.toByteArray()) }
                    val response = conn.inputStream.bufferedReader().readText()
                    Log.d("LocationService", "✅ API Response for ${user.token}: $response")
                } catch (e: Exception) {
                    Log.e("LocationService", "❌ Failed to sync location for ${user.token}", e)
                }
            }.start()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        handler.removeCallbacksAndMessages(null)
        unregisterReceiver(locationReceiver)
    }
}



================================================
FILE: android/app/src/main/java/com/deverp/location/UserData.kt
================================================
package com.deverp.location

data class UserData(
    val token: String,
    val link: String
)



================================================
FILE: android/app/src/main/res/drawable/rn_edit_text_material.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<!-- Copyright (C) 2014 The Android Open Source Project

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
-->
<inset xmlns:android="http://schemas.android.com/apk/res/android"
       android:insetLeft="@dimen/abc_edit_text_inset_horizontal_material"
       android:insetRight="@dimen/abc_edit_text_inset_horizontal_material"
       android:insetTop="@dimen/abc_edit_text_inset_top_material"
       android:insetBottom="@dimen/abc_edit_text_inset_bottom_material"
       >

    <selector>
        <!--
          This file is a copy of abc_edit_text_material (https://bit.ly/3k8fX7I).
          The item below with state_pressed="false" and state_focused="false" causes a NullPointerException.
          NullPointerException:tempt to invoke virtual method 'android.graphics.drawable.Drawable android.graphics.drawable.Drawable$ConstantState.newDrawable(android.content.res.Resources)'

          <item android:state_pressed="false" android:state_focused="false" android:drawable="@drawable/abc_textfield_default_mtrl_alpha"/>

          For more info, see https://bit.ly/3CdLStv (react-native/pull/29452) and https://bit.ly/3nxOMoR.
        -->
        <item android:state_enabled="false" android:drawable="@drawable/abc_textfield_default_mtrl_alpha"/>
        <item android:drawable="@drawable/abc_textfield_activated_mtrl_alpha"/>
    </selector>

</inset>



================================================
FILE: android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>


================================================
FILE: android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>


================================================
FILE: android/app/src/main/res/values/ic_launcher_background.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#042d6c</color>
</resources>


================================================
FILE: android/app/src/main/res/values/strings.xml
================================================
<resources>
    <string name="app_name">DevERP</string>
</resources>



================================================
FILE: android/app/src/main/res/values/styles.xml
================================================
<resources>
    <!-- Base App Theme -->
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
        <item name="colorPrimary">#251d50</item>
        <item name="colorAccent">#251d50</item>
    </style>

    <!-- Custom DatePicker Theme -->
    <style name="CustomDatePickerTheme" parent="Theme.MaterialComponents.DayNight.Dialog">
        <item name="colorPrimary">#251d50</item>
        <item name="colorPrimaryVariant">#1a1440</item>
        <item name="colorOnPrimary">#FFFFFF</item>
        <item name="colorAccent">#251d50</item>
    </style>
</resources>



================================================
FILE: android/app/src/main/res/xml/network_security_config.xml
================================================
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">support.deverp.net</domain>
  </domain-config>
</network-security-config>



================================================
FILE: android/app/.cxx/Debug/5m1j6044/hash_key.txt
================================================
# Values used to calculate the hash in this folder name.
# Should not depend on the absolute path of the project itself.
#   - AGP: 8.9.2.
#   - $NDK is the path to NDK 27.1.12297006.
#   - $PROJECT is the path to the parent folder of the root Gradle build file.
#   - $ABI is the ABI to be built with. The specific value doesn't contribute to the value of the hash.
#   - $HASH is the hash value computed from this text.
#   - $CMAKE is the path to CMake 3.22.1.
#   - $NINJA is the path to Ninja.
-H/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup
-DCMAKE_SYSTEM_NAME=Android
-DCMAKE_EXPORT_COMPILE_COMMANDS=ON
-DCMAKE_SYSTEM_VERSION=24
-DANDROID_PLATFORM=android-24
-DANDROID_ABI=$ABI
-DCMAKE_ANDROID_ARCH_ABI=$ABI
-DANDROID_NDK=$NDK
-DCMAKE_ANDROID_NDK=$NDK
-DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake
-DCMAKE_MAKE_PROGRAM=$NINJA
-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=$PROJECT/app/build/intermediates/cxx/Debug/$HASH/obj/$ABI
-DCMAKE_RUNTIME_OUTPUT_DIRECTORY=$PROJECT/app/build/intermediates/cxx/Debug/$HASH/obj/$ABI
-DCMAKE_BUILD_TYPE=Debug
-DCMAKE_FIND_ROOT_PATH=$PROJECT/app/.cxx/Debug/$HASH/prefab/$ABI/prefab
-B$PROJECT/app/.cxx/Debug/$HASH/$ABI
-GNinja
-DPROJECT_BUILD_DIR=$PROJECT/app/build
-DPROJECT_ROOT_DIR=$PROJECT
-DREACT_ANDROID_DIR=/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid
-DANDROID_STL=c++_shared
-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON


================================================
FILE: android/app/.cxx/Debug/5m1j6044/arm64-v8a/additional_project_files.txt
================================================
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/RNDateTimePickerCGen-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/RNCGeolocationSpec-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/VectorIconsMaterialIcons-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/RNImagePickerSpec-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/RNPermissionsSpec-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/rnreanimated-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/RNVectorIconsSpec-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/RNVectorIconsSpecJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/RNCWebViewSpec-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/RNCWebViewSpecJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/ComponentDescriptors.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/EventEmitters.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/Props.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/ShadowNodes.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/States.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/rnworkletsJSI-generated.cpp.o
/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/rnworklets-generated.cpp.o


================================================
FILE: android/app/.cxx/Debug/5m1j6044/arm64-v8a/android_gradle_build.json
================================================
{
  "buildFiles": [
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup/CMakeLists.txt"
  ],
  "cleanCommandsComponents": [
    [
      "/Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ninja",
      "-C",
      "/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a",
      "clean"
    ]
  ],
  "buildTargetsCommandComponents": [
    "/Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ninja",
    "-C",
    "/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a",
    "{LIST_OF_TARGETS_TO_BUILD}"
  ],
  "libraries": {
    "appmodules::@6890427a1f51a3e7e1df": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "appmodules",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libappmodules.so",
      "runtimeFiles": [
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so",
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so",
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so"
      ]
    },
    "react_codegen_RNCGeolocationSpec::@1b959fcb56e23f7716ba": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNCGeolocationSpec"
    },
    "react_codegen_RNCWebViewSpec::@eb48929f9f7453740a6c": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNCWebViewSpec"
    },
    "react_codegen_RNDateTimePickerCGen::@59b70ddc31ba2f8ef1d2": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNDateTimePickerCGen"
    },
    "react_codegen_RNImagePickerSpec::@f66ee9a2efecfb28bee4": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNImagePickerSpec"
    },
    "react_codegen_RNPermissionsSpec::@7ad697819b753921c957": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNPermissionsSpec"
    },
    "react_codegen_RNVectorIconsSpec::@479809fae146501fd34d": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_RNVectorIconsSpec"
    },
    "react_codegen_VectorIconsMaterialIcons::@31616434fa1e3b43792c": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_VectorIconsMaterialIcons"
    },
    "react_codegen_rnasyncstorage::@1596841e19ec5b9eeffe": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rnasyncstorage"
    },
    "react_codegen_rngesturehandler_codegen::@39f233abcd2c728bc6ec": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rngesturehandler_codegen"
    },
    "react_codegen_rnreanimated::@8afabad14bfffa3f8b9a": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rnreanimated"
    },
    "react_codegen_rnscreens::@25bcbd507e98d3a854ad": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rnscreens",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
      ]
    },
    "react_codegen_rnsvg::@4f40eb209d0c0b4a3b65": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rnsvg",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
      ]
    },
    "react_codegen_rnworklets::@68f58d84d4754f193387": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_rnworklets"
    },
    "react_codegen_safeareacontext::@7984cd80db47aa7b952a": {
      "toolchain": "toolchain",
      "abi": "arm64-v8a",
      "artifactName": "react_codegen_safeareacontext",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so"
      ]
    }
  },
  "toolchains": {
    "toolchain": {
      "cCompilerExecutable": "/Users/deverp/Library/Android/sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang.lld",
      "cppCompilerExecutable": "/Users/deverp/Library/Android/sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++.lld"
    }
  },
  "cFileExtensions": [],
  "cppFileExtensions": [
    "cpp"
  ]
}


================================================
FILE: android/app/.cxx/Debug/5m1j6044/arm64-v8a/android_gradle_build_mini.json
================================================
{
  "buildFiles": [
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/CMakeLists.txt",
    "/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup/CMakeLists.txt"
  ],
  "cleanCommandsComponents": [
    [
      "/Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ninja",
      "-C",
      "/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a",
      "clean"
    ]
  ],
  "buildTargetsCommandComponents": [
    "/Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ninja",
    "-C",
    "/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a",
    "{LIST_OF_TARGETS_TO_BUILD}"
  ],
  "libraries": {
    "react_codegen_RNVectorIconsSpec::@479809fae146501fd34d": {
      "artifactName": "react_codegen_RNVectorIconsSpec",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_safeareacontext::@7984cd80db47aa7b952a": {
      "artifactName": "react_codegen_safeareacontext",
      "abi": "arm64-v8a",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so"
      ]
    },
    "react_codegen_RNPermissionsSpec::@7ad697819b753921c957": {
      "artifactName": "react_codegen_RNPermissionsSpec",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_rngesturehandler_codegen::@39f233abcd2c728bc6ec": {
      "artifactName": "react_codegen_rngesturehandler_codegen",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_RNCWebViewSpec::@eb48929f9f7453740a6c": {
      "artifactName": "react_codegen_RNCWebViewSpec",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_RNDateTimePickerCGen::@59b70ddc31ba2f8ef1d2": {
      "artifactName": "react_codegen_RNDateTimePickerCGen",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "appmodules::@6890427a1f51a3e7e1df": {
      "artifactName": "appmodules",
      "abi": "arm64-v8a",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libappmodules.so",
      "runtimeFiles": [
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so",
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so",
        "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so"
      ]
    },
    "react_codegen_rnsvg::@4f40eb209d0c0b4a3b65": {
      "artifactName": "react_codegen_rnsvg",
      "abi": "arm64-v8a",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
      ]
    },
    "react_codegen_rnworklets::@68f58d84d4754f193387": {
      "artifactName": "react_codegen_rnworklets",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_rnasyncstorage::@1596841e19ec5b9eeffe": {
      "artifactName": "react_codegen_rnasyncstorage",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_RNCGeolocationSpec::@1b959fcb56e23f7716ba": {
      "artifactName": "react_codegen_RNCGeolocationSpec",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_rnreanimated::@8afabad14bfffa3f8b9a": {
      "artifactName": "react_codegen_rnreanimated",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_VectorIconsMaterialIcons::@31616434fa1e3b43792c": {
      "artifactName": "react_codegen_VectorIconsMaterialIcons",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_RNImagePickerSpec::@f66ee9a2efecfb28bee4": {
      "artifactName": "react_codegen_RNImagePickerSpec",
      "abi": "arm64-v8a",
      "runtimeFiles": []
    },
    "react_codegen_rnscreens::@25bcbd507e98d3a854ad": {
      "artifactName": "react_codegen_rnscreens",
      "abi": "arm64-v8a",
      "output": "/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so",
      "runtimeFiles": [
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so",
        "/Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
      ]
    }
  }
}


================================================
FILE: android/app/.cxx/Debug/5m1j6044/arm64-v8a/build.ninja
================================================
# CMAKE generated file: DO NOT EDIT!
# Generated by "Ninja" Generator, CMake Version 3.22

# This file contains all the build statements describing the
# compilation DAG.

# =============================================================================
# Write statements declared in CMakeLists.txt:
# 
# Which is the root file.
# =============================================================================

# =============================================================================
# Project: appmodules
# Configurations: Debug
# =============================================================================

#############################################
# Minimal version of Ninja required by this file

ninja_required_version = 1.8


#############################################
# Set configuration variable for custom commands.

CONFIGURATION = Debug
# =============================================================================
# Include auxiliary files.


#############################################
# Include rules file.

include CMakeFiles/rules.ninja

# =============================================================================

#############################################
# Logical path to working directory; prefix for absolute paths.

cmake_ninja_workdir = /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/
# =============================================================================
# Object build statements for SHARED_LIBRARY target appmodules


#############################################
# Order-only phony target for appmodules

build cmake_object_order_depends_target_appmodules: phony || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec cmake_object_order_depends_target_react_codegen_RNCWebViewSpec cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen cmake_object_order_depends_target_react_codegen_RNImagePickerSpec cmake_object_order_depends_target_react_codegen_RNPermissionsSpec cmake_object_order_depends_target_react_codegen_RNVectorIconsSpec cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons cmake_object_order_depends_target_react_codegen_rnasyncstorage cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen cmake_object_order_depends_target_react_codegen_rnreanimated cmake_object_order_depends_target_react_codegen_rnscreens cmake_object_order_depends_target_react_codegen_rnsvg cmake_object_order_depends_target_react_codegen_rnworklets cmake_object_order_depends_target_react_codegen_safeareacontext

build CMakeFiles/appmodules.dir/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o: CXX_COMPILER__appmodules_Debug /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp || cmake_object_order_depends_target_appmodules
  DEFINES = -Dappmodules_EXPORTS
  DEP_FILE = CMakeFiles/appmodules.dir/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -DLOG_TAG=\"ReactNative\" -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -I/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnscreens -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnsvg -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/react/renderer/components/RNVectorIconsSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/react/renderer/components/RNCWebViewSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/react/renderer/components/rnworklets -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = CMakeFiles/appmodules.dir
  OBJECT_FILE_DIR = CMakeFiles/appmodules.dir/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni

build CMakeFiles/appmodules.dir/OnLoad.cpp.o: CXX_COMPILER__appmodules_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp || cmake_object_order_depends_target_appmodules
  DEFINES = -Dappmodules_EXPORTS
  DEP_FILE = CMakeFiles/appmodules.dir/OnLoad.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -DLOG_TAG=\"ReactNative\" -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -I/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-screens/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnscreens -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-svg/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/rnsvg -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-vector-icons/android/build/generated/source/codegen/jni/react/renderer/components/RNVectorIconsSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-webview/android/build/generated/source/codegen/jni/react/renderer/components/RNCWebViewSpec -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-worklets/android/build/generated/source/codegen/jni/react/renderer/components/rnworklets -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = CMakeFiles/appmodules.dir
  OBJECT_FILE_DIR = CMakeFiles/appmodules.dir


# =============================================================================
# Link build statements for SHARED_LIBRARY target appmodules


#############################################
# Link the shared library /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libappmodules.so

build /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libappmodules.so: CXX_SHARED_LIBRARY_LINKER__appmodules_Debug rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/RNDateTimePickerCGen-generated.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/Props.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/States.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/RNCGeolocationSpec-generated.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/Props.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/States.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/VectorIconsMaterialIcons-generated.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/Props.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/States.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/RNImagePickerSpec-generated.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/Props.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/States.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/RNPermissionsSpec-generated.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/Props.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/States.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/rnreanimated-generated.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/RNVectorIconsSpec-generated.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/ComponentDescriptors.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/EventEmitters.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/Props.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/RNVectorIconsSpecJSI-generated.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/ShadowNodes.cpp.o RNVectorIconsSpec_autolinked_build/CMakeFiles/react_codegen_RNVectorIconsSpec.dir/react/renderer/components/RNVectorIconsSpec/States.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/RNCWebViewSpec-generated.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/ComponentDescriptors.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/EventEmitters.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/Props.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/RNCWebViewSpecJSI-generated.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/ShadowNodes.cpp.o RNCWebViewSpec_autolinked_build/CMakeFiles/react_codegen_RNCWebViewSpec.dir/react/renderer/components/RNCWebViewSpec/States.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/ComponentDescriptors.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/EventEmitters.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/Props.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/ShadowNodes.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/States.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/react/renderer/components/rnworklets/rnworkletsJSI-generated.cpp.o rnworklets_autolinked_build/CMakeFiles/react_codegen_rnworklets.dir/rnworklets-generated.cpp.o CMakeFiles/appmodules.dir/Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp.o CMakeFiles/appmodules.dir/OnLoad.cpp.o | /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so || /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so RNCGeolocationSpec_autolinked_build/react_codegen_RNCGeolocationSpec RNCWebViewSpec_autolinked_build/react_codegen_RNCWebViewSpec RNDateTimePickerCGen_autolinked_build/react_codegen_RNDateTimePickerCGen RNImagePickerSpec_autolinked_build/react_codegen_RNImagePickerSpec RNPermissionsSpec_autolinked_build/react_codegen_RNPermissionsSpec RNVectorIconsSpec_autolinked_build/react_codegen_RNVectorIconsSpec VectorIconsMaterialIcons_autolinked_build/react_codegen_VectorIconsMaterialIcons rnasyncstorage_autolinked_build/react_codegen_rnasyncstorage rngesturehandler_codegen_autolinked_build/react_codegen_rngesturehandler_codegen rnreanimated_autolinked_build/react_codegen_rnreanimated rnworklets_autolinked_build/react_codegen_rnworklets
  LANGUAGE_COMPILE_FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info
  LINK_FLAGS = -Wl,-z,max-page-size=16384 -Wl,--build-id=sha1 -Wl,--no-rosegment -Wl,--no-undefined-version -Wl,--fatal-warnings -Wl,--no-undefined -Qunused-arguments
  LINK_LIBRARIES = /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_safeareacontext.so  /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnscreens.so  /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libreact_codegen_rnsvg.so  /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so  /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/libs/android.arm64-v8a/libjsi.so  /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/libs/android.arm64-v8a/libreactnative.so  -latomic -lm
  OBJECT_DIR = CMakeFiles/appmodules.dir
  POST_BUILD = :
  PRE_LINK = :
  SONAME = libappmodules.so
  SONAME_FLAG = -Wl,-soname,
  TARGET_FILE = /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/intermediates/cxx/Debug/5m1j6044/obj/arm64-v8a/libappmodules.so
  TARGET_PDB = appmodules.so.dbg


#############################################
# Utility command for edit_cache

build CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build edit_cache: phony CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build rebuild_cache: phony CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_rnasyncstorage


#############################################
# Order-only phony target for react_codegen_rnasyncstorage

build cmake_object_order_depends_target_react_codegen_rnasyncstorage: phony || rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/Props.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/States.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage

build rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o: CXX_COMPILER__react_codegen_rnasyncstorage_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/rnasyncstorage-generated.cpp || cmake_object_order_depends_target_react_codegen_rnasyncstorage
  DEP_FILE = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni/react/renderer/components/rnasyncstorage -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir
  OBJECT_FILE_DIR = rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir



#############################################
# Object library react_codegen_rnasyncstorage

build rnasyncstorage_autolinked_build/react_codegen_rnasyncstorage: phony rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ComponentDescriptors.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/EventEmitters.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/Props.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/ShadowNodes.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/States.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/react/renderer/components/rnasyncstorage/rnasyncstorageJSI-generated.cpp.o rnasyncstorage_autolinked_build/CMakeFiles/react_codegen_rnasyncstorage.dir/rnasyncstorage-generated.cpp.o


#############################################
# Utility command for edit_cache

build rnasyncstorage_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build rnasyncstorage_autolinked_build/edit_cache: phony rnasyncstorage_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build rnasyncstorage_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnasyncstorage_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build rnasyncstorage_autolinked_build/rebuild_cache: phony rnasyncstorage_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_RNDateTimePickerCGen


#############################################
# Order-only phony target for react_codegen_RNDateTimePickerCGen

build cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen: phony || RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/RNDateTimePickerCGen-generated.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/RNDateTimePickerCGen-generated.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/RNDateTimePickerCGen-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/Props.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/Props.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/States.cpp.o: CXX_COMPILER__react_codegen_RNDateTimePickerCGen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen/States.cpp || cmake_object_order_depends_target_react_codegen_RNDateTimePickerCGen
  DEP_FILE = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/datetimepicker/android/build/generated/source/codegen/jni/react/renderer/components/RNDateTimePickerCGen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir
  OBJECT_FILE_DIR = RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen



#############################################
# Object library react_codegen_RNDateTimePickerCGen

build RNDateTimePickerCGen_autolinked_build/react_codegen_RNDateTimePickerCGen: phony RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/RNDateTimePickerCGen-generated.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ComponentDescriptors.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/EventEmitters.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/Props.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/RNDateTimePickerCGenJSI-generated.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/ShadowNodes.cpp.o RNDateTimePickerCGen_autolinked_build/CMakeFiles/react_codegen_RNDateTimePickerCGen.dir/react/renderer/components/RNDateTimePickerCGen/States.cpp.o


#############################################
# Utility command for edit_cache

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build RNDateTimePickerCGen_autolinked_build/edit_cache: phony RNDateTimePickerCGen_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build RNDateTimePickerCGen_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNDateTimePickerCGen_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build RNDateTimePickerCGen_autolinked_build/rebuild_cache: phony RNDateTimePickerCGen_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_RNCGeolocationSpec


#############################################
# Order-only phony target for react_codegen_RNCGeolocationSpec

build cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec: phony || RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/RNCGeolocationSpec-generated.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/RNCGeolocationSpec-generated.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/RNCGeolocationSpec-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/Props.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/Props.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/States.cpp.o: CXX_COMPILER__react_codegen_RNCGeolocationSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec/States.cpp || cmake_object_order_depends_target_react_codegen_RNCGeolocationSpec
  DEP_FILE = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-community/geolocation/android/build/generated/source/codegen/jni/react/renderer/components/RNCGeolocationSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir
  OBJECT_FILE_DIR = RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec



#############################################
# Object library react_codegen_RNCGeolocationSpec

build RNCGeolocationSpec_autolinked_build/react_codegen_RNCGeolocationSpec: phony RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/RNCGeolocationSpec-generated.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ComponentDescriptors.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/EventEmitters.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/Props.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/RNCGeolocationSpecJSI-generated.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/ShadowNodes.cpp.o RNCGeolocationSpec_autolinked_build/CMakeFiles/react_codegen_RNCGeolocationSpec.dir/react/renderer/components/RNCGeolocationSpec/States.cpp.o


#############################################
# Utility command for edit_cache

build RNCGeolocationSpec_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build RNCGeolocationSpec_autolinked_build/edit_cache: phony RNCGeolocationSpec_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build RNCGeolocationSpec_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNCGeolocationSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build RNCGeolocationSpec_autolinked_build/rebuild_cache: phony RNCGeolocationSpec_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_VectorIconsMaterialIcons


#############################################
# Order-only phony target for react_codegen_VectorIconsMaterialIcons

build cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons: phony || VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/VectorIconsMaterialIcons-generated.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/VectorIconsMaterialIcons-generated.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/VectorIconsMaterialIcons-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/Props.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/Props.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/States.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/States.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp.o: CXX_COMPILER__react_codegen_VectorIconsMaterialIcons_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_VectorIconsMaterialIcons
  DEP_FILE = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/@react-native-vector-icons/material-icons/android/build/generated/source/codegen/jni/react/renderer/components/VectorIconsMaterialIcons -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir
  OBJECT_FILE_DIR = VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons



#############################################
# Object library react_codegen_VectorIconsMaterialIcons

build VectorIconsMaterialIcons_autolinked_build/react_codegen_VectorIconsMaterialIcons: phony VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/VectorIconsMaterialIcons-generated.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ComponentDescriptors.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/EventEmitters.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/Props.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/ShadowNodes.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/States.cpp.o VectorIconsMaterialIcons_autolinked_build/CMakeFiles/react_codegen_VectorIconsMaterialIcons.dir/react/renderer/components/VectorIconsMaterialIcons/VectorIconsMaterialIconsJSI-generated.cpp.o


#############################################
# Utility command for edit_cache

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build VectorIconsMaterialIcons_autolinked_build/edit_cache: phony VectorIconsMaterialIcons_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build VectorIconsMaterialIcons_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/VectorIconsMaterialIcons_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build VectorIconsMaterialIcons_autolinked_build/rebuild_cache: phony VectorIconsMaterialIcons_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_rngesturehandler_codegen


#############################################
# Order-only phony target for react_codegen_rngesturehandler_codegen

build cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen: phony || rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/Props.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/States.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o: CXX_COMPILER__react_codegen_rngesturehandler_codegen_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/rngesturehandler_codegen-generated.cpp || cmake_object_order_depends_target_react_codegen_rngesturehandler_codegen
  DEP_FILE = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-gesture-handler/android/build/generated/source/codegen/jni/react/renderer/components/rngesturehandler_codegen -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir
  OBJECT_FILE_DIR = rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir



#############################################
# Object library react_codegen_rngesturehandler_codegen

build rngesturehandler_codegen_autolinked_build/react_codegen_rngesturehandler_codegen: phony rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/EventEmitters.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/Props.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/ShadowNodes.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/States.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/react/renderer/components/rngesturehandler_codegen/rngesturehandler_codegenJSI-generated.cpp.o rngesturehandler_codegen_autolinked_build/CMakeFiles/react_codegen_rngesturehandler_codegen.dir/rngesturehandler_codegen-generated.cpp.o


#############################################
# Utility command for edit_cache

build rngesturehandler_codegen_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build rngesturehandler_codegen_autolinked_build/edit_cache: phony rngesturehandler_codegen_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build rngesturehandler_codegen_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rngesturehandler_codegen_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build rngesturehandler_codegen_autolinked_build/rebuild_cache: phony rngesturehandler_codegen_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_RNImagePickerSpec


#############################################
# Order-only phony target for react_codegen_RNImagePickerSpec

build cmake_object_order_depends_target_react_codegen_RNImagePickerSpec: phony || RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/RNImagePickerSpec-generated.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/RNImagePickerSpec-generated.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/RNImagePickerSpec-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/Props.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/Props.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/States.cpp.o: CXX_COMPILER__react_codegen_RNImagePickerSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec/States.cpp || cmake_object_order_depends_target_react_codegen_RNImagePickerSpec
  DEP_FILE = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-image-picker/android/build/generated/source/codegen/jni/react/renderer/components/RNImagePickerSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir
  OBJECT_FILE_DIR = RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec



#############################################
# Object library react_codegen_RNImagePickerSpec

build RNImagePickerSpec_autolinked_build/react_codegen_RNImagePickerSpec: phony RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/RNImagePickerSpec-generated.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ComponentDescriptors.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/EventEmitters.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/Props.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/RNImagePickerSpecJSI-generated.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/ShadowNodes.cpp.o RNImagePickerSpec_autolinked_build/CMakeFiles/react_codegen_RNImagePickerSpec.dir/react/renderer/components/RNImagePickerSpec/States.cpp.o


#############################################
# Utility command for edit_cache

build RNImagePickerSpec_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build RNImagePickerSpec_autolinked_build/edit_cache: phony RNImagePickerSpec_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build RNImagePickerSpec_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNImagePickerSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build RNImagePickerSpec_autolinked_build/rebuild_cache: phony RNImagePickerSpec_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_RNPermissionsSpec


#############################################
# Order-only phony target for react_codegen_RNPermissionsSpec

build cmake_object_order_depends_target_react_codegen_RNPermissionsSpec: phony || RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/RNPermissionsSpec-generated.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/RNPermissionsSpec-generated.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/RNPermissionsSpec-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/Props.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/Props.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/States.cpp.o: CXX_COMPILER__react_codegen_RNPermissionsSpec_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec/States.cpp || cmake_object_order_depends_target_react_codegen_RNPermissionsSpec
  DEP_FILE = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-permissions/android/build/generated/source/codegen/jni/react/renderer/components/RNPermissionsSpec -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir
  OBJECT_FILE_DIR = RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec



#############################################
# Object library react_codegen_RNPermissionsSpec

build RNPermissionsSpec_autolinked_build/react_codegen_RNPermissionsSpec: phony RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/RNPermissionsSpec-generated.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ComponentDescriptors.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/EventEmitters.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/Props.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/RNPermissionsSpecJSI-generated.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/ShadowNodes.cpp.o RNPermissionsSpec_autolinked_build/CMakeFiles/react_codegen_RNPermissionsSpec.dir/react/renderer/components/RNPermissionsSpec/States.cpp.o


#############################################
# Utility command for edit_cache

build RNPermissionsSpec_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build RNPermissionsSpec_autolinked_build/edit_cache: phony RNPermissionsSpec_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build RNPermissionsSpec_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/RNPermissionsSpec_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build RNPermissionsSpec_autolinked_build/rebuild_cache: phony RNPermissionsSpec_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for OBJECT_LIBRARY target react_codegen_rnreanimated


#############################################
# Order-only phony target for react_codegen_rnreanimated

build cmake_object_order_depends_target_react_codegen_rnreanimated: phony || rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/EventEmitters.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/Props.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/ShadowNodes.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/States.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated

build rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/rnreanimated-generated.cpp.o: CXX_COMPILER__react_codegen_rnreanimated_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/rnreanimated-generated.cpp || cmake_object_order_depends_target_react_codegen_rnreanimated
  DEP_FILE = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/rnreanimated-generated.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -DLOG_TAG=\"ReactNative\" -fexceptions -frtti -std=c++20 -Wall -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-reanimated/android/build/generated/source/codegen/jni/react/renderer/components/rnreanimated -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir
  OBJECT_FILE_DIR = rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir



#############################################
# Object library react_codegen_rnreanimated

build rnreanimated_autolinked_build/react_codegen_rnreanimated: phony rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ComponentDescriptors.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/EventEmitters.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/Props.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/ShadowNodes.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/States.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/react/renderer/components/rnreanimated/rnreanimatedJSI-generated.cpp.o rnreanimated_autolinked_build/CMakeFiles/react_codegen_rnreanimated.dir/rnreanimated-generated.cpp.o


#############################################
# Utility command for edit_cache

build rnreanimated_autolinked_build/CMakeFiles/edit_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/ccmake -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake cache editor...
  pool = console
  restat = 1

build rnreanimated_autolinked_build/edit_cache: phony rnreanimated_autolinked_build/CMakeFiles/edit_cache.util


#############################################
# Utility command for rebuild_cache

build rnreanimated_autolinked_build/CMakeFiles/rebuild_cache.util: CUSTOM_COMMAND
  COMMAND = cd /Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a/rnreanimated_autolinked_build && /Users/deverp/Library/Android/sdk/cmake/3.22.1/bin/cmake --regenerate-during-build -S/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup -B/Users/deverp/Desktop/SandipMori/DevERP/android/app/.cxx/Debug/5m1j6044/arm64-v8a
  DESC = Running CMake to regenerate build system...
  pool = console
  restat = 1

build rnreanimated_autolinked_build/rebuild_cache: phony rnreanimated_autolinked_build/CMakeFiles/rebuild_cache.util

# =============================================================================
# Write statements declared in CMakeLists.txt:
# /Users/deverp/Desktop/SandipMori/DevERP/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# =============================================================================

# =============================================================================
# Object build statements for SHARED_LIBRARY target react_codegen_safeareacontext


#############################################
# Order-only phony target for react_codegen_safeareacontext

build cmake_object_order_depends_target_react_codegen_safeareacontext: phony || safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir

build safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewShadowNode.cpp.o: CXX_COMPILER__react_codegen_safeareacontext_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewShadowNode.cpp || cmake_object_order_depends_target_react_codegen_safeareacontext
  DEFINES = -Dreact_codegen_safeareacontext_EXPORTS
  DEP_FILE = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewShadowNode.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -Wpedantic -Wno-gnu-zero-variadic-macro-arguments -Wno-dollar-in-identifier-extension -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir
  OBJECT_FILE_DIR = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext

build safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewState.cpp.o: CXX_COMPILER__react_codegen_safeareacontext_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewState.cpp || cmake_object_order_depends_target_react_codegen_safeareacontext
  DEFINES = -Dreact_codegen_safeareacontext_EXPORTS
  DEP_FILE = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewState.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -Wpedantic -Wno-gnu-zero-variadic-macro-arguments -Wno-dollar-in-identifier-extension -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir
  OBJECT_FILE_DIR = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/common/cpp/react/renderer/components/safeareacontext

build safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/build/generated/source/codegen/jni/react/renderer/components/safeareacontext/ComponentDescriptors.cpp.o: CXX_COMPILER__react_codegen_safeareacontext_Debug /Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/build/generated/source/codegen/jni/react/renderer/components/safeareacontext/ComponentDescriptors.cpp || cmake_object_order_depends_target_react_codegen_safeareacontext
  DEFINES = -Dreact_codegen_safeareacontext_EXPORTS
  DEP_FILE = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/build/generated/source/codegen/jni/react/renderer/components/safeareacontext/ComponentDescriptors.cpp.o.d
  FLAGS = -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D__BIONIC_NO_PAGE_SIZE_MACRO -D_FORTIFY_SOURCE=2 -Wformat -Werror=format-security   -fno-limit-debug-info  -fPIC -Wall -Werror -fexceptions -frtti -std=c++20 -DFOLLY_NO_CONFIG=1 -Wpedantic -Wno-gnu-zero-variadic-macro-arguments -Wno-dollar-in-identifier-extension -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_CFG_NO_COROUTINES=1 -DFOLLY_MOBILE=1 -DFOLLY_HAVE_RECVMMSG=1 -DFOLLY_HAVE_PTHREAD=1 -DFOLLY_HAVE_XSI_STRERROR_R=1
  INCLUDES = -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/. -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../../common/cpp -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni -I/Users/deverp/Desktop/SandipMori/DevERP/node_modules/react-native-safe-area-context/android/src/main/jni/../../../build/generated/source/codegen/jni/react/renderer/components/safeareacontext -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/dd28153e477f01656e51c4dab7233750/transformed/fbjni-0.7.0/prefab/modules/fbjni/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/jsi/include -isystem /Users/deverp/.gradle/caches/8.14.1/transforms/ac4ebaf754dc18b487a31e43e5e3e9d1/transformed/react-android-0.80.2-debug/prefab/modules/reactnative/include
  OBJECT_DIR = safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir




// - 
Location tracker - foreground + background 
img upload - camera + gallery 
file upload - file selection - 
video recorder
qr/bar code scan
buissness card reader - camera + doc scan + gallery
