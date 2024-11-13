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
    import { Dialog, DialogContent } from "$lib/components/ui/dialog";
    import { appstate } from "$lib/store.svelte.js";

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
    <header class="absolute z-10 p-4 right-0">
        <div class="flex justify-end">
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
    <main class="grid overflow-hidden" style="min-height: calc(100vh - 56px)">
        <!-- Content will be injected here based on the active tab -->
        {#if appstate.activeView === "dashboard" || appstate.activeView === "challenge"}
            <ChallengeDashboard />
        {:else if appstate.activeView === "challenges"}
            <ChallengesOverview />
        {:else if appstate.activeView === "add"}
            <ChallengeEditor />
        {:else if appstate.activeView === "user"}
            <ChallengeUserpage />
        {/if}

        <Dialog open={appstate.activeView === "challenge"}>
            <DialogContent class="max-w-full h-screen flex flex-col">
                <Challenge />
            </DialogContent>
        </Dialog>
    </main>

    <nav class="">
        <div class="flex justify-around">
            <Button
                class="flex-1 rounded-none h-14 flex flex-col items-center bg-background hover:bg-background {appstate.activeView ===
                'dashboard'
                    ? 'text-accent'
                    : 'text-primary'}"
                onclick={() => (appstate.activeView = "dashboard")}
            >
                <Layout class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Dashboard</span>
            </Button>
            <Button
                class="flex-1 rounded-none h-14 flex flex-col items-center bg-background hover:bg-background {appstate.activeView ===
                'challenges'
                    ? 'text-accent'
                    : 'text-primary'}"
                onclick={() => (appstate.activeView = "challenges")}
            >
                <Dumbbell class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Challenges</span>
            </Button>
            <Button
                class="flex-1 rounded-none h-14 flex flex-col items-center bg-background bg-background hover:bg-background {appstate.activeView ===
                'add'
                    ? 'text-accent'
                    : 'text-primary'}"
                onclick={() => (appstate.activeView = "add")}
            >
                <Plus class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Add</span>
            </Button>
            <Button
                class="flex-1 rounded-none h-14 flex flex-col items-center bg-background hover:bg-background {appstate.activeView ===
                'user'
                    ? 'text-accent'
                    : 'text-primary'}"
                onclick={() => (appstate.activeView = "user")}
            >
                <Settings class="h-6 w-6 mb-1 min-w-[24px] min-h-[24px]" />
                <span class="text-xs">Settings</span>
            </Button>
        </div>
    </nav>
</div>
