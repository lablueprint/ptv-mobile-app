import React, { useState, useEffect } from 'react';
import {
  Text, Image, TouchableOpacity, StyleSheet, // KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  Card, Title, Paragraph,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { theme } from '../../style';
import calendarIcon from '../../assets/Icons/calendarIcon.png';

export default function EventPost({
  date, title,
}) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return (
    <TouchableOpacity style={styles.events}>
      <Card style={styles.eventContainer}>
        <Card.Content>
          <Title style={styles.titleText}>
            <Image source={calendarIcon}/>  {monthNames[date.toDate().getMonth()]} {date.toDate().getDate()}
          </Title>
          <Paragraph>{title}</Paragraph>
        </Card.Content>
        
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  events: {
    paddingTop: 7.5,
  },
  eventContainer: {
    width: '100%',
    padding: 5,
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 0,
    shadowColor: "white",
  },
  titleText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: theme.fonts.medium.fontWeight,
  },
});

EventPost.propTypes = {
  date: PropTypes.instanceOf(Date),
  title: PropTypes.string,
};
