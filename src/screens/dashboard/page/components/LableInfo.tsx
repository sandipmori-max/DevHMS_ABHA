import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styles } from '../page_style'
import InfoTooltip from './Tooltip'
import { ERP_COLOR_CODE } from '../../../../utils/constants'
import ShortAction from './ShortAction'

const LableInfo = ({
    isFromChild,
    item,
    theme,
    value
}: any) => {
  return (
   <>
   {
        !isFromChild &&   <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          { 
          item?.fieldtitle !== item?.tooltip ?
            <View  style={{
            flexDirection: "row",
            justifyContent:'space-between',
            width:'100%'
          }}>
             <View style={{flexDirection:'row', gap: 4}}>
                 <Text
            style={[
              styles.label,
              theme === "dark" && {
                color: "white",
              },
            ]}
          >
            {item?.fieldtitle}
          </Text>

          {item?.mandatory === "1" && (
            <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>
          )}
                </View>
         <>
         

           <View style={{
            justifyContent:'center', 
            alignContent:'center',
            alignItems:'center',
            flexDirection:'row', gap: 2}}>
            <ShortAction item={item} value={value} />
            {item?.fieldtitle !== item?.tooltip && (
            <InfoTooltip text={item.tooltip}/>
          )}
           </View>
         </>
              </View> :  <View
              
              style={{flexDirection:'row', gap: 4 , justifyContent:'space-between'}}>
            <View style={{ flexDirection:'row', width: '90%'}}>
                  <Text
            style={[
              styles.label,
              theme === "dark" && {
                color: "white",
              },
            ]}
          >
            {item?.fieldtitle}
          </Text>

          {item?.mandatory === "1" && (
            <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>
          )}
                </View>
 <ShortAction item={item} value={value} />
              </View>
          }
          
        </View>
       
      </View>
      }
   </>
  )
}

export default LableInfo
 