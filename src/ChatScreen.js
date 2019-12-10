import React, { Component } from 'react';
import ChatKit from '@pusher/chatkit-client';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import TypingIndicator from './components/TypingIndicator';
import WhoIsOnlineList from './components/WhoIsOnlineList';

class ChatScreen extends Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            currentRoom: {},
            currentUser: {},
            usersWhoAreTyping: [],
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
    }

    componentDidMount() {
        const chatManager = new ChatKit.ChatManager({
            instanceLocator: 'v1:us1:a17c1a25-91d3-468f-b692-dd20bce11c58',
            userId: this.props.currentUsername,
            tokenProvider: new ChatKit.TokenProvider({
                url: 'http://localhost:3001/authenticate'
            })
        })


        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                return currentUser.subscribeToRoom({
                    roomId: "5cebbed1-1521-468e-b974-6e8be714a713",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                        onUserStartedTyping: user => { 
                            this.setState({
                                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name]
                            })
                         },
                        onUserStoppedTyping: user => { 
                            this.setState({
                                usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                                    username => username !== user.name
                                )
                            })
                         },
                         onUserCameOnline: () => this.forceUpdate(),
                         onUserWentOffline: () => this.forceUpdate(),
                         onUserJoined: () => this.forceUpdate()
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
            })
            .catch(error => console.error('error', error))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            roomId: this.state.currentRoom.id,
            text
        })
    }

    sendTypingEvent () {
        this.state.currentUser
            .isTypingIn({roomId: this.state.currentRoom.id})
            .catch(error => console.error('error:', error))
    }

    render() {
        return (
            <div>
                <h1>Chat</h1>
                <WhoIsOnlineList
             currentUser={this.state.currentUser}  users={this.state.currentRoom.users}
           />
                <MessageList messages={this.state.messages} />
                <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                <SendMessageForm onSubmit={this.sendMessage} onChange={this.sendTypingEvent} />
            </div>
        )
    }
}

export default ChatScreen;