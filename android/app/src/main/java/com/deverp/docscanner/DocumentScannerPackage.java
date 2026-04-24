package com.deverp;

import com.facebook.react.*;
import java.util.*;

public class DocumentScannerPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext context) {
        return Arrays.asList(new DocumentScannerModule(context));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext context) {
        return Collections.emptyList();
    }
}