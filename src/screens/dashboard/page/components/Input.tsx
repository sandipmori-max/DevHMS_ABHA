import { View, Text, TextInput, Platform } from "react-native";
import React, { useState } from "react";
import { styles } from "../page_style";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useAppSelector } from "../../../../store/hooks";
import ShortAction from "./ShortAction";
import InputError from "../../../../components/error/InputError";
import LableInfo from "./LableInfo";

const Input = ({
  id,
  isValidate,
  item,
  errors,
  value,
  setValue,
  onFocus,
  isFromChild = false,
  isFromNew
}: any) => {
  const theme = useAppSelector((state) => state?.theme.mode);

  React.useEffect(() => {
    setValue(value);
  }, [value]);
  const [isInputEdit, setIsInputEdit] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState("");
 
  return (
    <View style={{ marginBottom: Platform.OS === 'android' ? 6 : 8 }}>
      <LableInfo isFromChild={isFromChild}
        item={item}
        theme={theme}
        value={value} />
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 0.8,
            borderRadius: 6,
            paddingRight: 6,
            backgroundColor: theme === "dark" ? "black" : "white",
            borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE
          },

          errors[item.field] && {
            borderColor: ERP_COLOR_CODE.ERP_ERROR,
          },

          value && {
            borderColor: "green",
          },

          isInputEdit && {
            borderColor: "#81b5e4",
          },

          item?.borderColor && {
            borderColor: item?.borderColor,
          },
        ]}
      >
        <TextInput
          maxLength={item?.size > 0 ? item?.size : 100}
          id={id}
          multiline={
            item?.size > 128
              ? true
              : value?.length > 40
                ? true
                : item?.title === "Card Text"
                  ? true
                  : false
          }
          editable
          scrollEnabled
          style={[
            styles.textInput,
            {
              flex: 1,
              borderWidth: 0,
              backgroundColor: "transparent",
            },

            item?.size > 255 && {
              minHeight: 80,
              textAlignVertical: "top",
            },

            theme === "dark" &&
            value && {
              color: "white",
            },

            isFromChild && {
              padding: 6,
              borderRadius: 4,
            },
          ]}
          keyboardType={
            item?.ctltype === "NUMERIC"
              ? "number-pad"
              : "default"
          }
          value={value.toString()}
          onChangeText={(text) => {

  // Only numbers allowed for NUMERIC type
  if (item?.ctltype === "NUMERIC") {
     // Check invalid characters
    const hasInvalidChar = /[^0-9]/.test(text);

    // Remove non-numeric chars
    const numericText = text.replace(/[^0-9]/g, "");

    setValue(numericText);

    // Invalid character error
    if (hasInvalidChar) {
      setMaxLengthError("Only numbers are allowed");
    }
    // Max length error
    else if ( item?.size > 0 && numericText.length >= item?.size) {
      setMaxLengthError(
        `Maximum ${item?.size} digits allowed`
      );
    }
    // Clear error
    else {
      setMaxLengthError("");
    }

    return;
  }

  // Normal text input
  setValue(text);

  if (item?.size > 0 && text.length >= item?.size) {
    setMaxLengthError(
      `Maximum ${item?.size} characters allowed`
    );
  } else {
    setMaxLengthError("");
  }
}}
          placeholder={`Enter ${item?.fieldtitle}`}
          onFocus={(e) => {
            setIsInputEdit(true);
            onFocus(e);
          }}
          onBlur={() => {
            if (!value) {
              setIsInputEdit(false);
            }
          }}
          placeholderTextColor={
            theme === "dark" ? "white" : "gray"
          }
        />
        {
          !isFromNew &&   <ShortAction item={item} value={value} />
        }
      
      </View>
      {errors[item.field] && <InputError error={errors[item?.field]} />}

       {!!maxLengthError && (
        <Text
          style={{
            color: ERP_COLOR_CODE.ERP_ERROR,
            fontSize: 12,
            marginTop: 4, 
          }}
        >
         - {maxLengthError}
        </Text>
      )}
    </View>
  );
};

export default Input;
