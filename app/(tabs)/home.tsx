import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('assistantWelcome'),
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response after a delay
    setTimeout(() => {
      // Here you would normally make an API call to get the AI response
      let aiResponse: Message;
      
      if (inputText.toLowerCase().includes('invoice') || 
          inputText.toLowerCase().includes('scan') || 
          inputText.toLowerCase().includes('upload')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: t('assistantInvoiceResponse'),
          isUser: false,
          timestamp: new Date(),
        };
      } else if (inputText.toLowerCase().includes('dashboard') || 
                inputText.toLowerCase().includes('report') || 
                inputText.toLowerCase().includes('analytics')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: t('assistantDashboardResponse'),
          isUser: false,
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: t('assistantDefaultResponse'),
          isUser: false,
          timestamp: new Date(),
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Scroll to bottom after receiving response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const renderMessage = (message: Message) => {
    return (
      <View 
        style={[
          styles.messageBubble, 
          message.isUser ? styles.userBubble : styles.aiBubble,
          message.isUser ? 
            (isDarkMode ? styles.darkUserBubble : {}) : 
            (isDarkMode ? styles.darkAiBubble : {})
        ]}
      >
        {!message.isUser && (
          <View style={styles.aiAvatarContainer}>
            <Ionicons name="analytics" size={24} color={isDarkMode ? "#007AFF" : "#007AFF"} />
          </View>
        )}
        <View style={styles.messageContent}>
          <Text 
            style={[
              styles.messageText, 
              message.isUser ? 
                (isDarkMode ? styles.darkUserText : {}) : 
                (isDarkMode ? styles.darkAiText : {})
            ]}
          >
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, isDarkMode && styles.darkBackground]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(message => (
          <View key={message.id} style={styles.messageWrapper}>
            {renderMessage(message)}
          </View>
        ))}
        {isProcessing && (
          <View style={[styles.messageBubble, styles.aiBubble, isDarkMode && styles.darkAiBubble]}>
            <View style={styles.aiAvatarContainer}>
              <Ionicons name="analytics" size={24} color={isDarkMode ? "#007AFF" : "#007AFF"} />
            </View>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder={t('askAssistant')}
          placeholderTextColor={isDarkMode ? '#777' : '#999'}
          value={inputText}
          onChangeText={setInputText}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!isProcessing}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]} 
          onPress={handleSend}
          disabled={!inputText.trim() || isProcessing}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={!inputText.trim() ? '#CCC' : '#007AFF'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#E9E9EB',
    alignSelf: 'flex-start',
  },
  darkUserBubble: {
    backgroundColor: '#0A84FF',
  },
  darkAiBubble: {
    backgroundColor: '#2C2C2E',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#000',
  },
  darkUserText: {
    color: 'white',
  },
  darkAiText: {
    color: '#FFF',
  },
  aiAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  darkInputContainer: {
    backgroundColor: '#1c1c1e',
    borderTopColor: '#38383A',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  darkInput: {
    backgroundColor: '#2C2C2E',
    borderColor: '#38383A',
    color: 'white',
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E8E93',
    marginHorizontal: 2,
    opacity: 0.7,
  },
}); 