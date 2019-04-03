import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '~/services/api';

import {
  View,
  Text,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Header from '~/components/Header';
import OrganizationItem from './OrganizationItem';

import styles from './styles';

//
//
//
// Route Tab -> Icon
const TabIcon = ({ tintColor }) => <Icon name="building" size={20} color={tintColor} />;
TabIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
//

export default class Organizations extends Component {
  static navigationOptions = {
    tabBarIcon: TabIcon,
  };

  state = {
    data: [],
    loading: true,
    refreshing: false,
  };

  componentDidMount() {
    this.loadOrganizations();
  }

  loadOrganizations = async () => {
    this.setState({ refreshing: true });

    const username = await AsyncStorage.getItem('@Githuber:username');

    const { data } = await api.get(`/users/${username}/orgs`);

    this.setState({ data, loading: false, refreshing: false });
  }

  renderList = () => {
    const { data, refreshing } = this.state;

    if (data.length === 0) {
      return (<Text style={styles.noOrgs}>Sem organizações.</Text>);
    }

    return (
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={this.renderListItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        onRefresh={this.loadOrganizations}
        refreshing={refreshing}
      />
    );
  }

  renderListItem = ({ item }) => <OrganizationItem organization={item} />

  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Organizações" />

        { loading ? <ActivityIndicator style={styles.loading} /> : this.renderList() }
      </View>
    );
  }
}
