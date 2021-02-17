import React from "react";
import io from "socket.io-client";
import emoji from "./Emoji"

class ChatroomPage extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                username: '',
                message: '',
                messages: [],
                writing: '',
                users: [],
                channel: [],
                join: '',
                numUsers: 0,
            };
            this.socket = io('http://localhost:4001/')
            this.state.join = localStorage.getItem('join');

            //SOCKET.IO
    
            //CONNEXION
            this.socket.on('connection', function() {
                this.setState({
                    messages: [...this.state.messages, 'data']
                });
            });
            //RECEPTION MSG
            this.socket.on('RECEIVE_MESSAGE', function(data) {
                addMessage(data);
                document.getElementsByClassName('messages')[0].scrollTo(0, 99999);
            });

            //NOMBRE UTILISATEUR CONNECTES
            this.socket.on('INFOS_CHANNEL', function(nb_co) {
                addInfos(nb_co)
            });

            //LISTE CHANNEL
            this.socket.on('LIST_CHANNEL', function(channel) {
                listChannel(channel)
            })

            //CHANGE CHANNEL
            this.socket.on('CHANGE_CHANNEL', function(channel) {
                localStorage.setItem('join', channel);
                changeChannel(channel)
            })

            //AJOUT DE CHANNEL
            this.socket.on('ADD_CHANNEL', function(channel) {
                addChannel(channel)
            });

            //LISTE USERS
            this.socket.on('LIST_USERS', function(users) {
                listUsers(users)
            });

            //AJOUT USERS
            this.socket.on('ADD_USERS', function(users) {
                addUsers(users)
            });

            //FONCTIONS CRUD

            /*AJOUT MSG*/
            const addMessage = data => {
                this.setState({
                    messages: [...this.state.messages, data]
                });
            }

            /*AFFICHE NOMBRE UTILISATEUR CONNECTES AU CHANNEL*/
            const addInfos = data => {
                this.setState({
                    numUsers: data
                });
            };

            /*LISTE CHANNEL*/
            const listChannel = data => {
                this.setState({
                    channel: data
                });
            };
            /*AJOUT CHANNEL*/
            const addChannel = data => {
                this.setState({
                    channel: [...this.state.channel, data]
                });
            };

            /*CHANGER CHANNEL*/
            const changeChannel = channel => {
                this.setState({
                    join: channel
                });
            }

            /*LISTE USERS*/
            const listUsers = data => {
                this.setState({
                    users: data
                });
            };

            /*AJOUT USER*/
            const addUsers = data => {
                this.setState({
                    users: [...this.state.users, data]
                });
            };

            //CLICK
            // CHANGER DE CHANNEL
            this.changeRoom = ev => {
                var room = ev.target.textContent;
                room = room.substr(0, room.length);
                this.setState({
                    messages: []
                });
                this.setState({
                    join: room
                });
                localStorage.setItem('join', room);
                this.socket.emit('JOIN_CHANNEL', room)
            }

            //CONTACTER UN UTILISATEUR
            this.contactUser = ev => {
                var user = ev.target.textContent;
                user = user.substr(3, user.length);
                this.setState({
                    message: [...this.state.message, '']
                });
                this.setState({
                    message: [...this.state.message, '/msg ' + user + ' ']
                });
            }

            //COMMANDES && ENVOI DE MESSAGE
            var i = 0;
            this.sendMessage = ev => {
                ev.preventDefault();

            //COMMANDES

            //CONNEXION
            if (this.state.message.includes('/nick')) {
                var user = this.state.message.split(' ');
                var info = {
                    socket_id: this.socket.id,
                    username: user[1]
                };
                var user_profile = []
                user_profile.push(info)
                localStorage.setItem('user', JSON.stringify(info));
                this.setState({
                    message: ''
                });
                this.socket.emit('CHECK_CONN', {
                    user_co: user[1]
                })
                this.socket.emit('ADD_USERS', {
                    id: this.socket.id,
                    username: user[1]
                })
            }

            //ENVOYER UN MSG PRIVE
            else if (this.state.message.includes('/msg')) {
                var data = this.state.message.split(' ');
                var msg = '';
                /*Reconstruction string à partir du 2eme argument*/
                for (var i = 2; i < data.length; i++) {
                    msg += data[i] + ' ';
                }
                this.socket.emit('PRIVATE_MESSAGE', data[1], msg)
            }

            //CREER UN CHANNEL
            else if (this.state.message.includes('/create')) {
                var data = this.state.message.split(' ');
                this.socket.emit('CREATE_CHANNEL', data[1])
            }

            //SUPPRIMER UN CHANNEL
            else if (this.state.message.includes('/delete')) {
                var data = this.state.message.split(' ');
                this.socket.emit('DELETE_CHANNEL', data[1])
            }

            //REJOINDRE UN CHANNEL
            else if (this.state.message.includes('/join')) {
                var data = this.state.message.split(' ');
                this.socket.emit('JOIN_CHANNEL', data[1])
            }

            //QUITTER UN CHANNEL
            else if (this.state.message.includes('/part')) {
                localStorage.removeItem('join');
                this.setState({
                    join: ''
                });
                this.socket.emit('LEAVE_CHANNEL')
            }

            //LISTER DES UTILISATEURS
            else if (this.state.message.includes('/users')) {
                var channel = localStorage.getItem('join')
                this.socket.emit('GET_USERS', channel)
            }

            //LISTER CHANNELS
            else if (this.state.message.includes('/list')) {
                this.socket.emit('GET_CHANNEL')
            }

            //CLEAR LE CHAT
            else if (this.state.message.includes('/clear')) {
                this.setState({
                    messages: []
                });
            } else {
                //ENVOI DE MESSAGES
                    if (localStorage.hasOwnProperty('user')) {
                        /*emoji*/
                        for (var input in emoji) {
                            this.state.message = this.state.message.replace(input, emoji[input])
                        }
                        /*date actuel*/
                        var now = new Date();
                        var hour = now.getHours();
                        var minute = now.getMinutes();
                        if (hour.toString().length == 1) {
                            hour = '0' + hour;
                        }
                        if (minute.toString().length == 1) {
                            minute = '0' + minute;
                        }
                        var date = hour + 'h' + minute;
                        var socket_id = JSON.parse(localStorage.getItem('user'))['socket_id']
                        var username = JSON.parse(localStorage.getItem('user'))['username']

                        //ENVOI CHANNEL
                        if (localStorage.hasOwnProperty('join')) {
                            var channel = localStorage.getItem('join')
                            this.socket.emit('SEND_CHANNEL_MESSAGE', {
                                socket_id: socket_id,
                                channel: channel,
                                image: 'fa fa-user-o',
                                author: username,
                                message: this.state.message,
                                date: date,
                            }, channel)
                        } else {
                        //ENVOI TOUS UTILISATEURS 
                            this.socket.emit('SEND_MESSAGE', {
                                socket_id: socket_id,
                                channel: "GENERAL",
                                image: 'fa fa-user-o',
                                author: username,
                                message: this.state.message,
                                date: date,
                            })
                        }
                    }
            }
            this.setState({
                message: ''
            });
        }
    }
    render(){
        return (
        <div className="chatroomPage">
            <div class="logochat"></div>
            <div class="text-chat">DISCHAT</div>
            <div class="sidenav">
                <strong class="big-title"><a class="main-title">MY DISCHAT</a></strong>
                    {this.state.channel.map(chat => {
                        return (
                            <a class="btn btn-outline-danger"  href="#" onClick={this.changeRoom}><i class="fa fa-hashtag"></i>{chat.name}</a>
                        )
                    })}
                
                <a class="channel-users"><i class="fa fa-user-circle"></i>
                    <strong>  Users</strong></a>
                    {this.state.users.map(user => {
                        return (
                            <a class="user-item"  href="#" onClick={this.contactUser}>🔵 {user.username}</a>
                        )
                    })}
            </div>
            <div className="chatroomSection">
                <div className="chatroomContent">
                </div>
                    <div class="block-chat">
                        <div >
                            <form action="">
                                <ul className="messages">
                                    {this.state.messages.map(message => {
                                    return (
                                        <li>
                                            <div class="block-msg-user"> 
                                                <div class="">{message.message}</div>
                                                <div class="block-msg-time">{message.date} <i class="fa fa-clock-o"></i></div> 
                                            </div>
                                        </li>
                                    )
                                    })}
                                </ul>
                                <div className="chatroomActions">
                                    <input list="cmd" class="mes" autocomplete="off" placeholder="Entrer votre texte!" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                                            <datalist id="cmd">
                                            <option value="/nick " />
                                            <option value="/create " />
                                            <option value="/join " />
                                            <option value="/part" />
                                            <option value="/delete " />
                                            <option value="/msg" />
                                            <option value="/list" />
                                            <option value="/users" />
                                            <option value="/clear" />
                                        </datalist>
                                    <button onClick={this.sendMessage} className="join"><i class="fa fa-paper-plane"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
            </div>
        </div>   
    );}
}

export default ChatroomPage;