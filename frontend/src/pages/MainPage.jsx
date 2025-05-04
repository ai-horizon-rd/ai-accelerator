import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import "katex/dist/katex.min.css";
import * as React from "react";
import Logo from "../assets/aihorizon-logo.png";
import AzureLogo from "../assets/azure_logo.png";
import AiMarkdown from "../components/AiMarkdown";
import {
  BLACK,
  CHAT_AI_COLOR,
  CHAT_USER_COLOR,
  containers,
  customScrollBar,
  GREEN,
  GREY,
  LIGHT_GREY,
  RED,
  WHITE,
} from "../components/consts";
import { FooterLine } from "../components/Footer";
import NotificationSnackbar from "../components/NotificationSnackbar";
import Typewriter from "../components/Typewriter";

export default function MainPage() {
  const testData = [
    { message: "Hallo from gpt2!", from: "gpt", timestamp: Date.now() },
    { message: "Hallo from user2!", from: "user", timestamp: Date.now() },
    { message: "Hallo from gpt!", from: "gpt", timestamp: Date.now() },
    { message: "Hallo from user!", from: "user", timestamp: Date.now() },
  ];

  const [inputText, setInputText] = React.useState("");

  const [chatArray, setChatArray] = React.useState([]);
  // const [chatArray, setChatArray] = React.useState(testData);

  const [loadingAnswer, setLoadingAnswer] = React.useState(false);

  const [skipAnimation, setSkipAnimation] = React.useState(false);
  const [writing, setWriting] = React.useState(false);

  const defaultSettings = {
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    system_prompt: "",
    reasoningEffort: "medium",
  };

  const [settings, setSettings] = React.useState(defaultSettings);

  async function sendMessage(chatMessage, clearInputField) {
    if (chatMessage === "") return;
    setChatArray((prev) => [
      {
        message: chatMessage,
        from: "user",
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    if (clearInputField) setInputText("");
    try {
      setLoadingAnswer(true);
      const res = await axios.post(
        "/api/openai",
        {
          message: chatMessage,
          conversation: JSON.stringify(chatArray.slice(0, 10)),
          config: JSON.stringify(settings),
          // model: "",
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      setLoadingAnswer(false);
      setChatArray((prev) => [
        {
          message: res.data.choices[0].message.content,
          from: "gpt",
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (e) {
      console.log(e);
      setLoadingAnswer(false);
      setChatArray((prev) => [
        {
          error: true,
          message: "Error in response. Please try again.",
          from: "gpt",
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 1,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 1,
            bgcolor: GREY,
            height: 95,
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Icon sx={{ width: "auto", height: 40, ml: 3 }}>
              <img draggable={false} src={AzureLogo} height="40px" />
            </Icon>
            <Typography
              sx={{
                ml: 2,
                mr: 3,
                fontFamily: "Roboto",
                color: WHITE,
                fontSize: 25,
                fontWeight: 300,
                userSelect: "none",
              }}
            >
              AI Accelerator
            </Typography>
          </Box>
          <Icon sx={{ width: "auto", height: 60 }}>
            <img draggable={false} src={Logo} height="60px" />
          </Icon>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: 1,
          }}
        >
          <Conversations
            chatArray={chatArray}
            setChatArray={setChatArray}
            setSkipAnimation={setSkipAnimation}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 750,
              maxWidth: 1 / 2,
              mt: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: 1,
                flexDirection: "column-reverse",
                overflowY: "scroll",
                minHeight: "60vh",
                maxHeight: "60vh",
                ...customScrollBar(),
              }}
            >
              {loadingAnswer && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "flex-start",
                    mr: 2,
                    ml: 4,
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  {/* <Typography sx={{ fontStyle: "italic", pr: 1 }}>
                    GPT schreibt...
                  </Typography> */}
                  <LinearProgress
                    sx={{
                      width: 100,
                      mt: 0.5,
                      backgroundColor: BLACK,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: GREEN,
                      },
                    }}
                  />
                </Box>
              )}
              {chatArray.map((chatObject, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      chatObject?.from === "user" ? "flex-end" : "flex-start",
                    alignSelf:
                      chatObject?.from === "user" ? "flex-end" : "flex-start",
                    mr: chatObject?.from === "user" ? 2 : 4,
                    ml: chatObject?.from === "gpt" ? 2 : 4,
                    mb: 1.5,
                  }}
                >
                  {/* <Typography sx={{ fontSize: 11, fontStyle: "italic", px: 1 }}>
                    {new Date(chatObject.timestamp).toLocaleString("de-DE", {
                      timeZone: "Europe/Berlin",
                    })}
                  </Typography> */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      bgcolor:
                        chatObject?.from === "user"
                          ? CHAT_USER_COLOR
                          : CHAT_AI_COLOR,
                      boxShadow: 4,
                    }}
                  >
                    {index !== 0 ||
                    chatObject?.from === "user" ||
                    chatObject?.error ? (
                      <AiMarkdown>{chatObject.message}</AiMarkdown>
                    ) : (
                      <Typewriter
                        text={chatObject.message}
                        delay={10}
                        skipAnimation={skipAnimation}
                        setSkipAnimation={setSkipAnimation}
                        setWriting={setWriting}
                        setChatArray={setChatArray}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <TextField
              disabled={writing}
              variant="filled"
              placeholder="Start a chat"
              onKeyDown={(e) => {
                if (e.keyCode === 13 && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText, true);
                }
              }}
              size="small"
              sx={{
                width: 1,
                ".MuiInputBase-root": {
                  borderRadius: 5,
                  py: 1,
                  pl: 2,
                  mt: { xs: 2, md: 5 },
                  display: "flex",
                  height: 100,
                },
              }}
              slotProps={{
                htmlInput: {
                  style: {
                    fontSize: 16,
                    lineHeight: 1,
                    textAlign: "center",
                  },
                },
                input: {
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: "0.5rem" }}>
                      {writing ? (
                        <IconButton onClick={() => setSkipAnimation(true)}>
                          <StopRoundedIcon color={RED} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => sendMessage(inputText, true)}
                        >
                          <SendRoundedIcon color={RED} />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                },
              }}
              multiline
              maxRows={2}
              spellCheck={false}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Box>
          <Box sx={{ width: 1 / 4 }} />
        </Box>
        <FooterLine sxObject={{ mt: 4 }} typographySx={{ fontSize: 14 }}>
          Built using Microsoft Azure
        </FooterLine>
        <Divider flexItem sx={{ bgcolor: LIGHT_GREY, mx: 4, mt: 2 }} />
      </Box>
    </Box>
  );
}

function Conversations({ chatArray, setChatArray, setSkipAnimation }) {
  const [conversationList, setConversationList] = React.useState([]);

  async function fetchConversations() {
    const read = await axios.post(
      "/api/readItems",
      {
        container: containers.CONVERSATION,
      },
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    setConversationList(read.data);
  }

  React.useEffect(() => {
    fetchConversations();
  }, []);

  const [openNotification, setOpenNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState("");

  async function saveConversation() {
    try {
      await axios.post(
        "/api/createItem",
        {
          item: JSON.stringify({
            conversation: chatArray,
          }),
          container: containers.CONVERSATION,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      fetchConversations();
      setNotificationMessage("Conversation saved.");
    } catch {
      setNotificationMessage("Error.");
    }
    setOpenNotification(true);
  }

  async function deleteConversation(conversationId) {
    try {
      await axios.post(
        "/api/deleteItem",
        {
          container: containers.CONVERSATION,
          itemId: conversationId,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      fetchConversations();
      setNotificationMessage("Conversation deleted.");
    } catch {
      setNotificationMessage("Error.");
    }
    setOpenNotification(true);
  }

  return (
    <Box
      sx={{
        width: 1 / 4,
        borderRadius: 2,
        mx: 2,
        pr: 1,
        py: 2,
        maxHeight: "50vh",
        overflowY: "scroll",
        ...customScrollBar(),
      }}
    >
      <NotificationSnackbar
        message={notificationMessage}
        open={openNotification}
        setOpen={setOpenNotification}
      />
      <Typography
        sx={{
          fontWeight: 300,
          fontSize: 20,
          userSelect: "none",
          mb: 2,
        }}
      >
        Conversations
      </Typography>
      <Button
        disabled={chatArray.length === 0}
        variant="outlined"
        sx={{
          borderRadius: 20,
          py: 0,
          textTransform: "none",
          fontWeight: 200,
          fontSize: 14,
        }}
        startIcon={<SaveOutlinedIcon />}
        onClick={() => saveConversation()}
      >
        Save current conversation
      </Button>
      {conversationList.map((conversationItem, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderRadius: 2,
            borderColor: GREY,
            p: 1,
            my: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: -1,
              ml: -1,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <IconButton
                sx={{ width: 30, height: 30 }}
                onClick={() => {
                  setChatArray(conversationItem.conversation);
                  setSkipAnimation("clear");
                }}
              >
                <CopyAllOutlinedIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton
                sx={{ width: 30, height: 30 }}
                onClick={() => deleteConversation(conversationItem.id)}
              >
                <DeleteOutlinedIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
            <Typography
              sx={{
                fontStyle: "italic",
                pr: 0.5,
                fontSize: 11,
                ml: 1,
                mt: 0.5,
              }}
            >
              {new Date(conversationItem.createdAt).toLocaleString("de-DE", {
                timeZone: "Europe/Berlin",
              })}
            </Typography>
          </Box>
          <Typography
            noWrap
            sx={{
              mt: 1,
              mx: 1,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {
              conversationItem.conversation[
                conversationItem.conversation.length - 1
              ].message
            }
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
