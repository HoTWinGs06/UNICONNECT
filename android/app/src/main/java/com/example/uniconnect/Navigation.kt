package com.example.uniconnect

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.uniconnect.ui.events.EventsScreen
import com.example.uniconnect.ui.feed.FeedScreen
import com.example.uniconnect.ui.grades.GradesScreen
import com.example.uniconnect.ui.groups.GroupsScreen
import com.example.uniconnect.ui.help.HelpScreen
import com.example.uniconnect.ui.messages.MessagesScreen
import com.example.uniconnect.ui.onboarding.OnboardingScreen
import com.example.uniconnect.ui.servers.ServersScreen
import com.example.uniconnect.ui.auth.AuthScreen
import com.example.uniconnect.viewmodel.AuthViewModel
import com.example.uniconnect.repository.AuthState

data class NavItem(
    val route: String,
    val label: String,
    val selectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    val unselectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    val badge: Int = 0,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainNavigation(authViewModel: AuthViewModel) {
    val authState by authViewModel.authState.collectAsState()
    var currentRoute by remember { mutableStateOf("auth") }
    val showBottomNav = currentRoute !in listOf("onboarding", "auth")
    val isFullScreen = currentRoute in listOf("servers", "messages", "auth")

    LaunchedEffect(authState) {
        if (authState == AuthState.Unauthenticated) {
            currentRoute = "auth"
        } else if (authState == AuthState.Authenticated && currentRoute == "auth") {
            currentRoute = "feed"
        }
    }

    val navItems = remember {
        listOf(
            NavItem("feed", "Feed", Icons.Filled.Home, Icons.Outlined.Home),
            NavItem("servers", "Servers", Icons.Filled.Dns, Icons.Outlined.Dns),
            NavItem("messages", "Messages", Icons.AutoMirrored.Filled.Chat, Icons.AutoMirrored.Outlined.Chat, badge = 2),
            NavItem("grades", "Grades", Icons.Filled.School, Icons.Outlined.School),
            NavItem("events", "Events", Icons.Filled.Event, Icons.Outlined.Event),
        )
    }

    Scaffold(
        topBar = {
            if (showBottomNav && !isFullScreen) {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Avatar
                            Box(modifier = Modifier.size(32.dp)) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.secondaryContainer),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Text("AM", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSecondaryContainer, fontWeight = FontWeight.Bold)
                                }
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(androidx.compose.ui.graphics.Color(0xFF22C55E))
                                        .align(Alignment.BottomEnd),
                                )
                            }
                            Spacer(Modifier.width(12.dp))
                            Text(
                                when (currentRoute) {
                                    "feed" -> "Campus Feed"
                                    "servers" -> "Servers"
                                    "messages" -> "Messages"
                                    "grades" -> "Academics"
                                    "events" -> "Events"
                                    "groups" -> "Study Groups"
                                    "help" -> "Help Request"
                                    else -> "UniConnect"
                                },
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.SemiBold,
                            )
                        }
                    },
                    actions = {
                        IconButton(onClick = {}) {
                            BadgedBox(badge = {
                                Badge { Text("3") }
                            }) {
                                Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                            }
                        }
                        IconButton(onClick = {}) {
                            Icon(Icons.Default.Search, contentDescription = "Search")
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface,
                    ),
                )
            }
        },
        bottomBar = {
            if (showBottomNav) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    tonalElevation = 2.dp,
                ) {
                    navItems.forEach { item ->
                        val selected = currentRoute == item.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = { currentRoute = item.route },
                            icon = {
                                if (item.badge > 0) {
                                    BadgedBox(badge = {
                                        Badge { Text(item.badge.toString()) }
                                    }) {
                                        Icon(
                                            if (selected) item.selectedIcon else item.unselectedIcon,
                                            contentDescription = item.label,
                                        )
                                    }
                                } else {
                                    Icon(
                                        if (selected) item.selectedIcon else item.unselectedIcon,
                                        contentDescription = item.label,
                                    )
                                }
                            },
                            label = { Text(item.label, fontSize = 10.sp, fontWeight = if (selected) FontWeight.Medium else FontWeight.Normal) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MaterialTheme.colorScheme.secondary,
                                selectedTextColor = MaterialTheme.colorScheme.secondary,
                                indicatorColor = MaterialTheme.colorScheme.secondaryContainer,
                            ),
                        )
                    }
                }
            }
        },
    ) { innerPadding ->
        AnimatedContent(
            targetState = currentRoute,
            transitionSpec = { fadeIn() togetherWith fadeOut() },
            label = "pageTransition",
            modifier = Modifier
                .fillMaxSize()
                .then(if (!isFullScreen) Modifier.padding(innerPadding) else Modifier.padding(bottom = innerPadding.calculateBottomPadding())),
        ) { route ->
            when (route) {
                "auth" -> AuthScreen(
                    viewModel = authViewModel,
                    onAuthSuccess = { currentRoute = "feed" },
                    modifier = Modifier.fillMaxSize()
                )
                "onboarding" -> OnboardingScreen(
                    onContinue = { currentRoute = "feed" },
                    modifier = Modifier.fillMaxSize(),
                )
                "feed" -> FeedScreen(modifier = Modifier.fillMaxSize())
                "servers" -> ServersScreen(modifier = Modifier.fillMaxSize())
                "messages" -> MessagesScreen(modifier = Modifier.fillMaxSize())
                "grades" -> GradesScreen(modifier = Modifier.fillMaxSize())
                "events" -> EventsScreen(modifier = Modifier.fillMaxSize())
                "groups" -> GroupsScreen(modifier = Modifier.fillMaxSize())
                "help" -> HelpScreen(
                    onBack = { currentRoute = "feed" },
                    modifier = Modifier.fillMaxSize(),
                )
            }
        }
    }
}
