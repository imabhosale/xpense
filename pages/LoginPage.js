import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient'; // Ensure you import your Supabase client
import tw from 'twrnc'; // Assuming you're using Tailwind CSS for styling
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const LoginScreen = () => {
  const navigation = useNavigation(); // Get the navigation object
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [notification, setNotification] = useState(''); // State for notifications

  const handleSendOTP = async () => {
    // Validate phone number format (ensure it includes country code)
    if (!mobileNumber || !/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(mobileNumber)) {
      setNotification('Please enter a valid mobile number in the format: +1234567890');
      return;
    }

    setLoading(true);
    // Sending OTP
    const { error } = await supabase.auth.signInWithOtp({ phone: mobileNumber });
    setLoading(false);
    
    if (error) {
      console.error('Error sending OTP:', error.message);
      setNotification(error.message); // Set notification for error
    } else {
      setIsOtpSent(true);
      setNotification('OTP has been sent to your mobile number.'); // Set notification for success
    }
  };

  const handleVerifyOTP = async () => {
    // Validate OTP input
    if (!otp) {
      setNotification('Please enter the OTP.');
      return;
    }

    setLoading(true);
    // Verifying OTP with the correct verification type
    const { user, error } = await supabase.auth.verifyOtp({
      phone: mobileNumber,
      token: otp,
      type: 'sms' // Specify the type of verification
    });
    setLoading(false);
    
    if (error) {
      console.error('Error verifying OTP:', error.message);
      setNotification(error.message); // Set notification for error
    } else {
      console.log('User verified successfully:', user);
      setNotification('You have logged in successfully!'); // Set notification for success

      // Navigate to Home
      navigation.navigate('Home'); // Ensure this corresponds to your Home screen name in your navigator
    }
  };

  return (
    <View style={tw`flex-1 justify-center px-6 bg-slate-100`}>
      {/* Notification Message */}
      {notification ? (
        <Text style={tw`text-red-500 text-center mb-4`}>{notification}</Text>
      ) : null}

      {!isOtpSent ? (
        <>
          <TextInput
            style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-6 text-lg`}
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={handleSendOTP} 
            disabled={loading}
            style={tw`bg-blue-500 py-4 rounded-lg`}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-center text-lg`}>Send OTP</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-6 text-lg`}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity 
            onPress={handleVerifyOTP} 
            disabled={loading}
            style={tw`bg-blue-500 py-4 rounded-lg`}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-center text-lg`}>Verify OTP</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
