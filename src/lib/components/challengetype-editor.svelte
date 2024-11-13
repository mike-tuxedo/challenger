<script>
    import { scale, fade, fly } from "svelte/transition";
    import { Button } from "$lib/components/ui/button";
    import { Dumbbell, Heart, Calendar } from "lucide-svelte";
    import { appstate } from "$lib/store.svelte.js";

    import ChallengeEditorSport from "./sport-editor.svelte";
    import ChallengeEditorHabit from "./habit-editor.svelte";
    import ChallengeEditorOntime from "./ontime-editor.svelte";

    let selectedType = $state(null);

    if (appstate.editingChallenge) {
        selectedType = appstate.editingChallenge.type;
    }

    function createNewChallenge(type) {
        selectedType = type;
        appstate.editingChallenge = null;
    }
</script>

{#if !selectedType}
    <div class="page" transition:scale|global={{ duration: 250, start: 0.9 }}>
        <h1 class="headline">Choose a Challengetype</h1>
        <div class="content content-center">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant={selectedType === "sport" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("sport")}
                >
                    <Dumbbell class="h-8 w-8 mb-2" />
                    <span>Sport Challenge</span>
                </Button>
                <Button
                    variant={selectedType === "habit" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("habit")}
                >
                    <Heart class="h-8 w-8 mb-2" />
                    <span>Habit Challenge</span>
                </Button>
                <Button
                    variant={selectedType === "onetime" ? "default" : "outline"}
                    class="h-32 flex flex-col items-center justify-center"
                    on:click={() => createNewChallenge("onetime")}
                >
                    <Calendar class="h-8 w-8 mb-2" />
                    <span>One-time Challenge</span>
                </Button>
            </div>
        </div>
    </div>
{:else if selectedType == "sport"}
    <ChallengeEditorSport bind:selectedType />
{:else if selectedType == "habit"}
    <div class="page" transition:scale|global={{ duration: 250, start: 0.9 }}>
        <ChallengeEditorHabit bind:selectedType />
    </div>
{:else if selectedType == "onetime"}
    <div class="page" transition:scale|global={{ duration: 250, start: 0.9 }}>
        <ChallengeEditorOntime bind:selectedType />
    </div>
{/if}
