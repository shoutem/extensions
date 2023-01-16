package com.shoutem.shopify;

import android.util.Log;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Shoutem on 24/10/2019.
 */

public class ShopifyPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(
        ReactApplicationContext reactContext
    ) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ShopifyModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(
        ReactApplicationContext reactContext
    ) {
        return Collections.emptyList();
    }
}
