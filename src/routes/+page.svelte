<script>
    import { scale, fade, fly } from "svelte/transition";
    import { Button } from "$lib/components/ui/button";
    import {
        Share2,
        CircleAlert,
        Plus,
        Layout,
        Dumbbell,
        User,
        Settings,
    } from "lucide-svelte";
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from "$lib/components/ui/tooltip";
    import {
        Dialog,
        DialogContent,
    } from "$lib/components/ui/dialog";
    import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "$lib/components/ui/drawer";
    import { appstate } from "$lib/store";

    import ChallengeDashboard from "$lib/components/dashboard.svelte";
    import ChallengeEditor from "$lib/components/challengetype-editor.svelte";
    import ChallengeUserpage from "$lib/components/userpage.svelte";
    import ChallengesOverview from "$lib/components/challenges.svelte";
    import Challenge from "$lib/components/challenge.svelte";

    function shareChallenge() {
        console.log("Sharing challenge...");
    }

    function showInfo() {
        console.log("Showing info...");
    }
</script>

<div class="flex flex-col h-screen">
    <header class="bg-background border-b p-4">
        <div class="flex justify-between items-center">
            <h1 class="text-1xl font-bold">
                {#if $appstate.activeView === "dashboard" || $appstate.activeView === "challenge"}
                    Dashboard
                {:else if $appstate.activeView === "challenges"}
                    Challenges
                {:else if $appstate.activeView === "add"}
                    Challenge editor
                {:else if $appstate.activeView === "user"}
                    User
                {/if}
            </h1>
            <div class="flex items-center space-x-2">
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            onclick={shareChallenge}
                        >
                            <Share2 class="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Share</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <Button variant="ghost" size="icon" onclick={showInfo}>
                            <CircleAlert class="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Info</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </header>

    <main class="relative flex-grow overflow-hidden p-4">
        <!-- Content will be injected here based on the active tab -->
        {#if $appstate.activeView === "dashboard" || $appstate.activeView === "challenge"}
            <div
                class="absolute top-0 left-0 h-full w-full overflow-auto p-4"
                transition:scale|global={{ duration: 250, start: 0.9 }}
            >
                <ChallengeDashboard />
            </div>
        {:else if $appstate.activeView === "challenges"}
            <div
                class="absolute top-0 left-0 h-full w-full overflow-auto p-4"
                transition:scale|global={{ duration: 250, start: 0.9 }}
            >
                <ChallengesOverview />
            </div>
        {:else if $appstate.activeView === "add"}
            <div
                class="absolute top-0 left-0 h-full w-full overflow-auto p-4"
                transition:scale|global={{ duration: 250, start: 0.9 }}
            >
                <ChallengeEditor />
            </div>
        {:else if $appstate.activeView === "user"}
            <div
                class="absolute top-0 left-0 h-full w-full overflow-auto p-4"
                transition:scale|global={{ duration: 250, start: 0.9 }}
            >
                <ChallengeUserpage />
            </div>
        {/if}

        <Dialog open={$appstate.activeView === 'challenge'}>
            <DialogContent class="max-w-full h-screen flex flex-col">
                <Challenge />
            </DialogContent>
        </Dialog>
    </main>

    <nav class="bg-background border-t">
        <div class="flex justify-around">
            <Button
                variant={$appstate.activeView === "dashboard"
                    ? "default"
                    : "ghost"}
                class="flex-1 rounded-none h-14 flex flex-col items-center"
                onclick={() => ($appstate.activeView = "dashboard")}
            >
                <Layout class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Dashboard</span>
            </Button>
            <Button
                variant={$appstate.activeView === "challenges"
                    ? "default"
                    : "ghost"}
                class="flex-1 rounded-none h-14 flex flex-col items-center"
                onclick={() => ($appstate.activeView = "challenges")}
            >
                <Dumbbell class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Challenges</span>
            </Button>
            <Button
                variant={$appstate.activeView === "add" ? "default" : "ghost"}
                class="flex-1 rounded-none h-14 flex flex-col items-center"
                onclick={() => ($appstate.activeView = "add")}
            >
                <Plus class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Add</span>
            </Button>
            <Button
                variant={$appstate.activeView === "user" ? "default" : "ghost"}
                class="flex-1 rounded-none h-14 flex flex-col items-center"
                onclick={() => ($appstate.activeView = "user")}
            >
                <Settings class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Settings</span>
            </Button>
        </div>
    </nav>
</div>
