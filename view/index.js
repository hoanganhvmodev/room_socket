const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        name: '',
        text: '',
        messages: {
            room1: [],
            room2: [],
            room3: [],
        },
        socket: null,
        activeRoom: '',
        rooms: {
            room1: false,
            room2: false,
            room3: false,
        }
    },
    methods: {
        sendMessage() {
            //check if user aactive room
            if (this.isMemberActiveRoom && this.validateInput()) {
                const message = {
                    name: this.name,
                    text: this.text,
                    room: this.activeRoom
                }
                this.socket.emit('message', message)
                this.text = ''
            } else {
                alert('You must choose a room to send the message');
            }
        },
        receivedMessage(message) {
            this.messages[message.room].push(message)
        },
        validateInput() {
            return this.name.length > 0 && this.text.length > 0
        },
        toggleRoomMembership() {
            if (this.isMemberActiveRoom) {
                this.socket.emit('leaveRoom', this.activeRoom);
            } else {
                this.socket.emit('joinRoom', this.activeRoom);
            }
        }
    },
    computed: {
        isMemberActiveRoom() {
            return this.rooms[this.activeRoom];
        }
    },
    created() {
        this.socket = io('http://localhost:3000')
        this.socket.on('message', (message) => {
            this.receivedMessage(message)
        });
        this.socket.on('connect', () => {
            this.toggleRoomMembership()
        });
        this.socket.on('joinedRoom', (room) => {
            this.rooms[room] = true;
        });
        this.socket.on('leftRoom', (room) => {
            location.reload();
            this.rooms[room] = false;
        });
    }
})