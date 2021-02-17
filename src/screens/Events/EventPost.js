import React, { useState, useEffect } from 'react';
import {
  Text, Image, TouchableOpacity, StyleSheet, // KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  Card, Title, ActivityIndicator, IconButton, Menu, Divider, Portal, Dialog, Paragraph, Button,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { theme } from '../../style';
import calendarIcon from '../../assets/Icons/calendarIcon.png';

export default function EventPost({
  date, description, location, title, type, postID,
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
  description: PropTypes.string,
  location: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  postID: PropTypes.string.isRequired,
};