import React, {
  useState, useEffect,
} from 'react';
import {
  Text, ScrollView, View, FlatList, StyleSheet,
} from 'react-native';
import { theme } from '../../style';
import firestore from '@react-native-firebase/firestore';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import EventPost from './EventPost';

export default function EventsHomeScreen() {
  const [events, setEvents] = useState([]);
  const [marked, setMarked] = useState({});

  useEffect(() => {
    firestore()
      .collection('events')
      .get()
      .then((querySnapshot) => {
        const updatedEvents = querySnapshot.docs.map(doc => doc.data());
        setEvents(updatedEvents);

        updatedEvents.forEach((day) => {
          let newdate = day.date.toDate().getFullYear() + "-" + ('0' + (day.date.toDate().getMonth() + 1).toString().slice(-2)) + "-" + day.date.toDate().getDate();
          setMarked(marked => ({
            ...marked, [newdate]: {selected: true, selectedColor: theme.colors.primary}}));
        })
      })
      .catch((error) => {

      });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Calendar 
        style={styles.calendar}
        markedDates={marked}
        
        />
      <FlatList
        style={styles.scrollContainer}
        data={events.map((post) => {
          return {
            ...post,
          };
        })}
        renderItem={({ item }) => (
          <EventPost 
            date={item.date.toDate()}
            title={item.title}
          />
        )}
        />
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  calendar: {
    height: 325,
  },
  scrollContainer: {
    height: '100%',
    alignSelf: 'center',
    marginHorizontal: '5%',
    marginVertical: '5%',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },

});