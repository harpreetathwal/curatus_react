import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Button,
  TouchableHighlight
 } from 'react-native';
import { Constants, AppLoading } from 'expo';
import { createStackNavigator } from 'react-navigation';


class UserFeed extends React.Component {
  access_token= '2294830151.672299c.08dfa0ef01d24bab89184d310faa3ee6'
   
  static navigationOptions = ({ navigation }) => {
   return {
      headerTitle: (
        <View style={{alignSelf: 'center', flex: 1}}>
          <Image
            resizeMode="cover"
            style={styles.top_bar}
            source={require('./static/images/top_bar.png')}
          />
        </View>
      ),
    };
  };

  state = {
    loaded: false,
    data: null,
    comments: []
  }

  componentDidMount (){
    this.fetchFeed()
  }

  async fetchFeed () {
    let response = await fetch(
      'https://api.instagram.com/v1/users/self/media/recent/?access_token=' +
      this.access_token
    )

    let posts = await response.json()
    let comments = await this.makeCommentsList(posts.data)

    this.setState({
      loaded: true,
      data: posts.data,
      comments: comments
    })
  }

  async makeCommentsList (posts) {
    let postsArray = posts.map(async (post) => {
      let postId = post.id

      if (post.comments.count === 0) {
        return (
          <View style={styles.comment} key={postId}>
            <Text>No Comments!</Text>
          </View>
        )
      } else {
        let response = await fetch(
          'https://api.instagram.com/v1/media/' +
          postId +
          '/comments?access_token=' +
          this.access_token
        )
        let comments = await response.json()
        let commentsArray = comments.data

        let commentsList = commentsArray.map(commentInfo =>{
          return (
            <View style={styles.comment} key={commentInfo.id}>
              <Text style={styles.commentText}>{commentInfo.from.username}</Text>
              <Text>{commentInfo.text}</Text>
            </View>
          )
        })
        return commentsList
      }
    })

    postsArray = await Promise.all(postsArray)
    return postsArray
  }

  createPost (postInfo, index) {
    let imageUri = postInfo.images.standard_resolution.url
    let username = postInfo.user.username
    let numLikes = postInfo.likes.count

    return (
      <View>
        <Image style={styles.image} source={{ uri: imageUri }} />
        <View style={styles.info}>
          <Text style={styles.infoText}>{username}</Text>
          <Text style={styles.infoText}>
            {numLikes+ (numLikes !== 1 ? ' likes' : ' like')}
          </Text>
        </View>
          <View>
            {this.state.comments[index]}
          </View>
      </View>
    )
  }

  render () {
    if (!this.state.loaded){
      return (
        <AppLoading />
      )
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({item, index}) => this.createPost(item, index)}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}



class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
   return {
      headerLeft: (
        <View style={{alignSelf: 'center', flex: 1}}>
          <Image
            resizeMode="cover"
            style={styles.top_bar}
            source={require('./static/images/top_bar.png')}
          />
        </View>
      ),
    };
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
   return {
      headerLeft: (
        <View style={{alignSelf: 'center', flex: 1}}>
          <Image
            resizeMode="cover"
            style={styles.top_bar}
            source={require('./static/images/top_bar.png')}
          />
        </View>
      ),
    };
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Go To Feed"
          onPress={() => this.props.navigation.push('UserFeed')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    UserFeed: {
      screen: UserFeed,
    },
  },
  {
    initialRouteName: 'Home',
  }
);






export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignSelf: 'center',
    paddingTop: Constants.statusBarHeight
  },
  top_bar: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width/8,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderColor: '#d8d8d8',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  comment: {
    flexDirection: 'row',
    padding:10,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderColor: '#d8d8d8'
  },
  commentText: {
    paddingRight: 15,
    fontWeight: 'bold'
  },
})
