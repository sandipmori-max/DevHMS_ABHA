package com.deverp;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.*;
import com.google.mlkit.vision.documentscanner.*;

import java.io.*;
import java.util.UUID;

public class DocumentScannerModule extends ReactContextBaseJavaModule {

    public static final String NAME = "DocumentScanner";
    private Callback callback;
    private static final int REQUEST_CODE = 101;

    public DocumentScannerModule(ReactApplicationContext context) {
        super(context);

        context.addActivityEventListener(new BaseActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if (requestCode == REQUEST_CODE) {
                    handleResult(resultCode, data);
                }
            }
        });
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void launchScanner(ReadableMap options, Callback cb) {
        Activity activity = getCurrentActivity();
        if (activity == null) return;

        this.callback = cb;

        GmsDocumentScannerOptions scannerOptions =
                new GmsDocumentScannerOptions.Builder()
                        .setPageLimit(1) // ✅ single scan
                        .build();

        GmsDocumentScanner scanner = GmsDocumentScanning.getClient(scannerOptions);

        scanner.getStartScanIntent(activity)
                .addOnSuccessListener(intent -> {
                    try {
                        activity.startIntentSenderForResult(
                                intent, REQUEST_CODE, null, 0, 0, 0
                        );
                    } catch (Exception e) {
                        sendError(e.getMessage());
                    }
                })
                .addOnFailureListener(e -> sendError(e.getMessage()));
    }

    private void handleResult(int resultCode, Intent data) {
        if (callback == null) return;

        if (resultCode == Activity.RESULT_CANCELED) {
            WritableMap res = new WritableNativeMap();
            res.putBoolean("didCancel", true);
            callback.invoke(res);
            return;
        }

        GmsDocumentScanningResult result =
                GmsDocumentScanningResult.fromActivityResultIntent(data);

        WritableArray arr = new WritableNativeArray();

        if (result != null && result.getPages().size() > 0) {
            Uri uri = result.getPages().get(0).getImageUri(); // single page

            WritableMap img = new WritableNativeMap();
            img.putString("uri", uri.toString());
            img.putString("fileName", UUID.randomUUID() + ".jpg");
            img.putInt("width", 0);
            img.putInt("height", 0);
            img.putInt("fileSize", 0);

            arr.pushMap(img);
        }

        WritableMap res = new WritableNativeMap();
        res.putArray("images", arr);
        callback.invoke(res);
    }

    private void sendError(String msg) {
        WritableMap err = new WritableNativeMap();
        err.putBoolean("error", true);
        err.putString("errorMessage", msg);
        callback.invoke(err);
    }
}