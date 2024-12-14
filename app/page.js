import Image from "next/image";
import styles from "./page.module.css";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  CardContent,
  Dialog,
  Card,
  CardActionArea,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid, 
  Stack
} from '@mui/material';

export default function Home() {
  
    const [messages, setMessages] = useState([
      {
        role : "assistant",
        content:  "Hi, I'm the Rate My City support Assitant. How can I help you." 
      }
    ])

    const [message, setMessage] = useState('')
      const sendMessage = async () =>{
        setMessages((messages) =>[
        {role: "user", content: messages},
        {role: "assistant", content:''}
      ])

      setMessage('')
      const response = fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...messages, {role: "user", content: message}])
      }).then(async(res) => {

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        let result  = ''
        return reader.read().then(function processText({done, value}){
          if(done){
            return result
          }
          const text = decoder.decode(value || new Uint8Array(), {stream: true})
              setMessages((message) => {
              //database operation. makes it so you var begave as expeected 

              let lastMessage = message[message.length - 1]
              let otherMessages = message.slice(0, message.length - 1)

              return [
                ...otherMessages,
                {...lastMessage, content: lastMessage.content + text},
              ]
          })
          return reader.read().then(processText)
      })
    })
  }
    return ( <Box 
    width="100vw" 
    height = "100vh" 
    display="flex" 
    flexDirection="column" 
    justifyContent="center"
    alignItems="center">

      <Stack direction="column"
        width= "500px" 
        height="700px"
        border="1px solid Black" 
        p={2}
        spacing={3}
        >
          <Stack
            directions="column"
            spacing={2}
            flexGrow={1}
            overflow={'auto'}
            maxHeight='100%'
            >
          {messages.map((message, index) => (
            <Box key={index} dislay="flex" justifyContent={message.role === "assitant" ? 'flex-start' : 'flex-end'}
            >
            <Box bgcolor={message.role === 'assistant' ? "primary.main": "secondary.main"
            }
            color ="white"
            borderRadius={16}
            p={3}
            >
              {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack direction = "row" spacing={2}>                                                                                                                                                                                                                                
          <TextField
            label = "Message"
            fullWidth
            value={message}                                                                                                                                                            ={message}
            onChange={(e)=>{setMessage(e.target.value)}}
            />
          <Button
            variant='contained'
            onClick={sendMessage}>
              Send
            </Button>
        </Stack>
      </Stack>
    </Box>
    )
}
