import { View } from 'react-native';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { contactRequests, messages } from '../db/mockData';
import { spacing } from '../design/theme';

export function MessengerPage() {
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Messenger" caption="WhatsApp-ähnlich, aber Chat erst nach bestätigter Anfrage." />
      {contactRequests.map((request) => (
        <Card key={request.id}>
          <AppText weight="900">Kontaktanfrage von {request.fromUser}</AppText>
          <AppText muted>{request.message}</AppText>
          <AppText muted>Status: {request.status}</AppText>
        </Card>
      ))}
      {messages.map((message) => (
        <Card key={message.id} style={{ alignSelf: message.senderId === 'SidePilot' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
          <AppText weight="800">{message.senderId}</AppText>
          <AppText>{message.text}</AppText>
        </Card>
      ))}
    </View>
  );
}
