import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function SearchBar({ filterQuery, filterFunction }) {
    const [query, setQuery] = useState(filterQuery);
    const handleQuery = () => {
        filterFunction(query);
    }

    return (
      <TextInput
        placeholder="Search Posts"
        onChangeText={(input) => { setQuery(input); handleQuery(); }}
        value={query}
        onSubmitEditing={handleQuery}
        returnKeyType="search"
      />
    );
}
  
SearchBar.propTypes = {
  filterQuery: PropTypes.string.isRequired,
  filterForumPosts: PropTypes.func.isRequired,
};