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