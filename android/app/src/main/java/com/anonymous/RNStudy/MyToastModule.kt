package com.anonymous.RNStudy

import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MyToastModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    // Method to specify the module name
    // (Used when calling AndroidToast.show(...) from JS)
    override fun getName(): String {
        return "AndroidToast"
    }

    // Use @ReactMethod annotation to define methods
    // that can be called from JS
    // (Kotlin mapping: suspend fun X!!! fun O!!!, use Promise for async processing)
    @ReactMethod
    fun show(message: String) {
        // Toast must run on the UI thread
        val context = reactApplicationContext

        // Display Toast message on the UI thread
        // Similar to Compose's LaunchedEffect(Dispatchers.Main)
        getCurrentActivity()?.runOnUiThread {
            Toast.makeText(context, message, Toast.LENGTH_LONG).show()
        }
    }
}

