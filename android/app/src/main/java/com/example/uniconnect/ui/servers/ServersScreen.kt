package com.example.uniconnect.ui.servers

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ServersScreen(modifier: Modifier = Modifier) {
    var selectedServer by remember { mutableStateOf("all") }
    var selectedChannel by remember { mutableStateOf("general") }

    Row(modifier = modifier.fillMaxSize()) {
        // Server rail
        ServerRail(
            selectedServer = selectedServer,
            onSelectServer = { selectedServer = it },
        )

        // Channel list
        ChannelList(
            serverName = serverDisplayName(selectedServer),
            selectedChannel = selectedChannel,
            onSelectChannel = { selectedChannel = it },
            modifier = Modifier.width(220.dp),
        )

        // Chat area
        ChatArea(
            channelName = selectedChannel,
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun ServerRail(
    selectedServer: String,
    onSelectServer: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxHeight()
            .width(68.dp)
            .background(MaterialTheme.colorScheme.surfaceContainerHighest)
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        // All servers
        ServerPill(
            label = "🌐",
            selected = selectedServer == "all",
            onClick = { onSelectServer("all") },
        )

        HorizontalDivider(
            modifier = Modifier.width(32.dp).padding(vertical = 4.dp),
            color = MaterialTheme.colorScheme.outlineVariant,
        )

        // Year servers
        listOf("Y1", "Y2", "Y3", "Y4").forEach { year ->
            ServerPill(
                label = year,
                selected = selectedServer == year.lowercase(),
                onClick = { onSelectServer(year.lowercase()) },
                isText = true,
            )
        }

        HorizontalDivider(
            modifier = Modifier.width(32.dp).padding(vertical = 4.dp),
            color = MaterialTheme.colorScheme.outlineVariant,
        )

        // Special servers
        ServerPill(label = "🎓", selected = selectedServer == "faculty", onClick = { onSelectServer("faculty") })
        ServerPill(label = "👥", selected = selectedServer == "clubs", onClick = { onSelectServer("clubs") })

        Spacer(Modifier.weight(1f))

        // Add server
        Surface(
            modifier = Modifier.size(48.dp),
            shape = RoundedCornerShape(16.dp),
            color = Color.Transparent,
            border = ButtonDefaults.outlinedButtonBorder(enabled = true),
            onClick = {},
        ) {
            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                Icon(Icons.Default.Add, contentDescription = "Create Server", tint = MaterialTheme.colorScheme.outline)
            }
        }
    }
}

@Composable
private fun ServerPill(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    isText: Boolean = false,
) {
    Surface(
        modifier = Modifier.size(48.dp),
        shape = RoundedCornerShape(if (selected) 12.dp else 16.dp),
        color = if (selected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceContainerLow,
        onClick = onClick,
    ) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
            if (isText) {
                Text(
                    label,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = if (selected) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                Text(label, fontSize = 20.sp)
            }
        }
    }
}

@Composable
private fun ChannelList(
    serverName: String,
    selectedChannel: String,
    onSelectChannel: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .background(MaterialTheme.colorScheme.surfaceContainer),
    ) {
        // Server header
        Column(modifier = Modifier.padding(16.dp)) {
            Text(serverName, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            Text("12 Channels", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

        LazyColumn(modifier = Modifier.weight(1f).padding(horizontal = 8.dp, vertical = 8.dp)) {
            // Text channels
            item {
                ChannelSectionHeader("TEXT CHANNELS")
            }
            item { ChannelItem("general", "tag", selectedChannel == "general", 0, onSelectChannel) }
            item { ChannelItem("announcements", "campaign", selectedChannel == "announcements", 3, onSelectChannel) }
            item { ChannelItem("resources", "folder_open", selectedChannel == "resources", 0, onSelectChannel) }
            item { ChannelItem("help-desk", "help_outline", selectedChannel == "help-desk", 0, onSelectChannel) }

            // Subject channels
            item {
                Spacer(Modifier.height(12.dp))
                ChannelSectionHeader("SUBJECTS")
            }
            item { ChannelItem("data-structures", "tag", selectedChannel == "data-structures", 0, onSelectChannel) }
            item { ChannelItem("algorithms", "tag", selectedChannel == "algorithms", 0, onSelectChannel) }
            item { ChannelItem("databases", "tag", selectedChannel == "databases", 0, onSelectChannel) }

            // Voice channels
            item {
                Spacer(Modifier.height(12.dp))
                ChannelSectionHeader("VOICE CHANNELS")
            }
            item { ChannelItem("Study Room 1", "volume_up", selectedChannel == "Study Room 1", 0, onSelectChannel, voiceUsers = 2) }
            item { ChannelItem("Study Room 2", "volume_up", selectedChannel == "Study Room 2", 0, onSelectChannel) }
            item { ChannelItem("Meeting Room", "videocam", selectedChannel == "Meeting Room", 0, onSelectChannel) }
        }

        // User bar
        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surfaceContainerLowest)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(modifier = Modifier.size(32.dp)) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.secondaryContainer),
                    contentAlignment = Alignment.Center,
                ) {
                    Text("AM", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSecondaryContainer)
                }
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF22C55E))
                        .align(Alignment.BottomEnd),
                )
            }
            Spacer(Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text("Alex Martinez", style = MaterialTheme.typography.labelSmall)
                Text("Online", style = MaterialTheme.typography.labelSmall, color = Color(0xFF16A34A), fontSize = 10.sp)
            }
            IconButton(onClick = {}, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Settings, contentDescription = "Settings", modifier = Modifier.size(18.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
private fun ChannelSectionHeader(title: String) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(Icons.Default.ExpandMore, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.width(4.dp))
        Text(title, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant, letterSpacing = 1.sp)
    }
}

@Composable
private fun ChannelItem(
    name: String,
    iconName: String,
    selected: Boolean,
    badge: Int,
    onClick: (String) -> Unit,
    voiceUsers: Int = 0,
) {
    val icon = when (iconName) {
        "campaign" -> Icons.Default.Campaign
        "folder_open" -> Icons.Default.FolderOpen
        "help_outline" -> Icons.Default.HelpOutline
        "volume_up" -> Icons.Default.VolumeUp
        "videocam" -> Icons.Default.Videocam
        else -> Icons.Default.Tag
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(6.dp),
        color = if (selected) MaterialTheme.colorScheme.surfaceContainerLow else Color.Transparent,
        onClick = { onClick(name) },
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.width(8.dp))
            Text(
                name,
                style = MaterialTheme.typography.bodyMedium,
                color = if (selected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f),
            )
            if (badge > 0) {
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(20.dp),
                ) {
                    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                        Text(badge.toString(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSecondary)
                    }
                }
            }
            if (voiceUsers > 0) {
                Row(horizontalArrangement = Arrangement.spacedBy((-4).dp)) {
                    repeat(voiceUsers) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(if (it == 0) Color(0xFF4ADE80) else Color(0xFF60A5FA)),
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ChatArea(channelName: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxHeight().background(MaterialTheme.colorScheme.background)) {
        // Channel header
        Surface(
            modifier = Modifier.fillMaxWidth().height(56.dp),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 1.dp,
        ) {
            Row(
                modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(Icons.Default.Tag, contentDescription = null, modifier = Modifier.size(18.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.width(8.dp))
                Text(channelName, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.weight(1f))
                IconButton(onClick = {}) { Icon(Icons.Default.Search, contentDescription = "Search", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = {}) { Icon(Icons.Default.PushPin, contentDescription = "Pins", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = {}) { Icon(Icons.Default.People, contentDescription = "Members", modifier = Modifier.size(20.dp)) }
            }
        }

        // Messages
        LazyColumn(
            modifier = Modifier.weight(1f).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            item {
                ChatMessage(
                    initials = "PK",
                    name = "Prof. Kim",
                    time = "Today at 9:15 AM",
                    message = "Good morning everyone! Quick reminder: Assignment 3 on Binary Search Trees is due this Friday at midnight. Please don't hesitate to visit office hours if you're stuck.",
                    nameColor = MaterialTheme.colorScheme.primaryContainer,
                    reactions = listOf("👍" to 8, "✅" to 5),
                )
            }
            item {
                ChatMessage(
                    initials = "AN",
                    name = "Aisha N.",
                    time = "Today at 9:42 AM",
                    message = "Thanks for the reminder! I had a quick question about balancing AVL trees — is the rotation logic the same as in the textbook chapter, or should we follow the approach from the lecture slides?",
                    nameColor = MaterialTheme.colorScheme.secondary,
                )
            }
            item {
                ChatMessage(
                    initials = "CR",
                    name = "Carlos R.",
                    time = "Today at 10:05 AM",
                    message = "Hey Aisha, I had the same confusion. I ended up going with the lecture slides version because Prof. Kim confirmed in OH yesterday that's what we'll be tested on.",
                    nameColor = MaterialTheme.colorScheme.primaryContainer,
                )
            }
        }

        // Chat input
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp,
        ) {
            Row(
                modifier = Modifier.padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.AddCircle, contentDescription = "Add", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceContainerLow,
                ) {
                    TextField(
                        value = "",
                        onValueChange = {},
                        placeholder = { Text("Message #$channelName", style = MaterialTheme.typography.bodyMedium) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = TextFieldDefaults.colors(
                            unfocusedContainerColor = Color.Transparent,
                            focusedContainerColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent,
                            focusedIndicatorColor = Color.Transparent,
                        ),
                        singleLine = true,
                    )
                }
                Spacer(Modifier.width(8.dp))
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.EmojiEmotions, contentDescription = "Emoji", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(20.dp))
                }
                FilledIconButton(
                    onClick = {},
                    modifier = Modifier.size(36.dp),
                    colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.secondary),
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
private fun ChatMessage(
    initials: String,
    name: String,
    time: String,
    message: String,
    nameColor: Color,
    reactions: List<Pair<String, Int>> = emptyList(),
) {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center,
        ) {
            Text(initials, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Column {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(name, style = MaterialTheme.typography.labelMedium, color = nameColor)
                Text(time, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            }
            Spacer(Modifier.height(4.dp))
            Text(message, style = MaterialTheme.typography.bodyMedium)
            if (reactions.isNotEmpty()) {
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    reactions.forEach { (emoji, count) ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surfaceContainer,
                            onClick = {},
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                            ) {
                                Text(emoji, fontSize = 14.sp)
                                Text(count.toString(), style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Medium)
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun serverDisplayName(id: String): String = when (id) {
    "all" -> "All Campus Servers"
    "y1" -> "Year 1 Server"
    "y2" -> "Year 2 Server"
    "y3" -> "Year 3 Server"
    "y4" -> "Year 4 Server"
    "faculty" -> "Faculty Lounge"
    "clubs" -> "Clubs & Societies"
    else -> "Server"
}
