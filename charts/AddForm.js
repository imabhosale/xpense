import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import Popup from './PopUp';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define available resource types and icons
const resourceTypes = [
  { name: 'Crop', icon: 'sprout' }, // Sprout icon for Crop
  { name: 'Vehicle', icon: 'tractor' }, // Tractor icon for Vehicle
  { name: 'Cattle', icon: 'cow' }, // Cow icon for Cattle
];

const AddForm = () => {
  const navigation = useNavigation();

  // State management
  const [selectedResourceType, setSelectedResourceType] = useState(resourceTypes[0].name);
  const [resourceName, setResourceName] = useState('');
  const [resourceSize, setResourceSize] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSave = () => {
    if (resourceName && resourceSize && resourceDescription && startDate) {
      setPopupMessage('Details saved successfully!');
      setPopupVisible(true);
    } else {
      setPopupMessage('Please fill all fields');
      setPopupVisible(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
      <View style={tw`p-4 bg-white rounded-lg shadow-md mx-4 my-8`}>
        <Text style={tw`text-xl font-bold mb-4 text-center`}>
          Create Resource
        </Text>

        {/* Horizontal ScrollView for selecting resource type */}
        <Text style={tw`mb-2 font-bold`}>Select Resource Type:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}>
          {resourceTypes.map((type) => (
            <TouchableOpacity
              key={type.name}
              style={[
                tw`flex-row items-center py-2 px-4 mr-2 rounded-full`,
                selectedResourceType === type.name
                  ? tw`bg-blue-500`
                  : tw`bg-gray-300`,
              ]}
              onPress={() => setSelectedResourceType(type.name)}>
              <MaterialCommunityIcons
                name={type.icon}
                size={20}
                color={selectedResourceType === type.name ? 'white' : 'black'}
                style={tw`mr-2`}
              />
              <Text
                style={tw`font-bold ${
                  selectedResourceType === type.name ? 'text-white' : 'text-black'
                }`}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input for Resource Name */}
        <Text style={tw`mb-1 font-bold`}>Enter Name of Resource:</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder="Enter resource name"
          value={resourceName}
          onChangeText={setResourceName}
        />

        {/* Input for Resource Size */}
        <Text style={tw`mb-1 font-bold`}>Enter Resource Size:</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder="Enter resource size"
          value={resourceSize}
          onChangeText={setResourceSize}
          keyboardType="numeric"
        />

        {/* Input for Resource Description */}
        <Text style={tw`mb-1 font-bold`}>Enter Resource Description:</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder="Enter resource description"
          value={resourceDescription}
          onChangeText={setResourceDescription}
          multiline
          numberOfLines={4}
        />

        {/* Start Date */}
        <Text style={tw`mb-1 font-bold`}>Enter Start Date:</Text>
        <TouchableOpacity
          style={tw`border border-gray-300 p-3 rounded mb-4`}
          onPress={() => setShowDatePicker(true)}>
          <Text style={tw`text-gray-600`}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Save and Cancel Buttons */}
        <View style={tw`flex-row justify-around mt-4`}>
          <TouchableOpacity
            style={tw`border border-green-500 bg-white py-2 px-4 rounded-full`}
            onPress={handleSave}>
            <Text style={tw`text-black font-bold`}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`border border-red-500 bg-white py-2 px-4 rounded-full`}
            onPress={() => navigation.navigate('Home')}>
            <Text style={tw`text-black font-bold`}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Popup for displaying messages */}
        <Popup
          visible={popupVisible}
          message={popupMessage}
          onClose={() => {
            setPopupVisible(false);
            if (popupMessage === 'Details saved successfully!') {
              navigation.navigate('Home'); // Navigate only when saving is successful
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default AddForm;
