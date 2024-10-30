<script>
	import { Button } from "$lib/components/ui/button";
	import { Shield, Share2, Download, DollarSign, Github, User, Dumbbell, Target, Users, Sun, Moon } from "lucide-svelte";;
	import { Toggle } from "$lib/components/ui/toggle";
    import { goto } from "$app/navigation";

	let isDarkMode = $state(false);

    function gotToApp() {
        goto('/app');
    }

	function downloadApp() {
		console.log("Downloading app...");
	}

	function donate() {
		console.log("Opening donation page...");
	}

	function visitGithub() {
		window.open("https://github.com/challenger-app", "_blank");
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle("dark", isDarkMode);
	}
</script>

<div class={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
	<header class="bg-[#ff8400] text-white py-4">
		<div class="container mx-auto px-4 flex justify-between items-center">
			<h1 class="text-3xl font-bold">Challenger</h1>
			<Toggle pressed={isDarkMode} onpressed={toggleTheme} aria-label="Toggle theme">
				{#if isDarkMode}
					<Moon class="h-5 w-5" />
				{:else}
					<Sun class="h-5 w-5" />
				{/if}
			</Toggle>
		</div>
	</header>

	<main class="flex-grow bg-gradient-to-b from-[#ff8400] via-[#ff9933] to-[#ffb366]">
		<section class="py-20">
			<div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
				<div class="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
					<h2 class="text-4xl font-bold mb-4 text-white">Challenge Yourself, Achieve More</h2>
					<p class="text-xl mb-8 text-white">Create, share, and conquer fitness challenges with Challenger</p>
					<Button size="lg" onclick={gotToApp} class="bg-white text-[#ff8400] hover:bg-[#ffb366]">Try the Browserapp</Button>
				</div>
				<div class="md:w-1/2">
					<img src="/images/hero.jpeg" alt="Challenger App" class="rounded-lg shadow-lg" />
				</div>
			</div>
		</section>

		<section class="py-20 bg-white">
			<div class="container mx-auto px-4">
				<h2 class="text-3xl font-bold text-center mb-12 text-[#ff8400]">Features</h2>
				<div class="space-y-20">
					<div class="flex flex-col md:flex-row items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<img src="/images/createchallenges.webp" alt="Create Custom Challenges" class="rounded-lg shadow-lg" />
						</div>
						<div class="md:w-1/2 md:pl-8">
							<h3 class="text-2xl font-bold mb-4 flex items-center text-[#ff8400]">
								<Dumbbell class="mr-2 h-6 w-6" />
								Create Custom Challenges
							</h3>
							<p class="text-lg">Design your own fitness challenges with exercises, reps, sets, and schedules.</p>
						</div>
					</div>
					<div class="flex flex-col md:flex-row-reverse items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<img src="/images/progress.jpeg" alt="Track Progress" class="rounded-lg shadow-lg" />
						</div>
						<div class="md:w-1/2 md:pr-8">
							<h3 class="text-2xl font-bold mb-4 flex items-center text-[#ff8400]">
								<Target class="mr-2 h-6 w-6" />
								Track Progress
							</h3>
							<p class="text-lg">Monitor your performance and stay motivated with built-in progress tracking.</p>
						</div>
					</div>
					<div class="flex flex-col md:flex-row items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<img src="/images/community.webp" alt="Community Challenges" class="rounded-lg shadow-lg" />
						</div>
						<div class="md:w-1/2 md:pl-8">
							<h3 class="text-2xl font-bold mb-4 flex items-center text-[#ff8400]">
								<Users class="mr-2 h-6 w-6" />
								Community Challenges
							</h3>
							<p class="text-lg">Discover and participate in challenges created by the Challenger community.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-[#ff8400] text-white py-20">
			<div class="container mx-auto px-4 text-center">
				<h2 class="text-3xl font-bold mb-8">Download Challenger Now</h2>
				<Button variant="secondary" size="lg" onclick={downloadApp} class="bg-white text-[#ff8400] hover:bg-[#ffb366]">
					<Download class="mr-2 h-5 w-5" />
					Google Playstore
				</Button>
                <Button variant="secondary" size="lg" onclick={downloadApp} class="bg-white text-[#ff8400] hover:bg-[#ffb366]">
					<Download class="mr-2 h-5 w-5" />
					Install Browser app
				</Button>
			</div>
		</section>

		<section class="py-20 bg-white">
			<div class="container mx-auto px-4">
				<h2 class="text-3xl font-bold text-center mb-12 text-[#ff8400]">Why Choose Challenger?</h2>
				<div class="space-y-20">
					<div class="flex flex-col md:flex-row items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<img src="/images/privacy.jpeg" alt="Data Privacy" class="rounded-lg shadow-lg" />
						</div>
						<div class="md:w-1/2 md:pl-8">
							<h3 class="text-2xl font-bold mb-4 flex items-center text-[#ff8400]">
								<Shield class="mr-2 h-6 w-6" />
								Data Privacy
							</h3>
							<p class="text-lg">Your data stays on your device with our local-first storage approach. Your privacy is our priority.</p>
						</div>
					</div>
					<div class="flex flex-col md:flex-row-reverse items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<img src="/images/share.jpeg" alt="Share If You Want" class="rounded-lg shadow-lg" />
						</div>
						<div class="md:w-1/2 md:pr-8">
							<h3 class="text-2xl font-bold mb-4 flex items-center text-[#ff8400]">
								<Share2 class="mr-2 h-6 w-6" />
								Share If You Want
							</h3>
							<p class="text-lg">Choose to keep your challenges private or share them with the community. You're in control.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-[#ffb366] py-20">
			<div class="container mx-auto px-4 text-center">
				<h2 class="text-3xl font-bold mb-8 text-white">Support Challenger</h2>
				<p class="mb-8 text-white">If you enjoy using Challenger, consider supporting its development.</p>
				<Button variant="default" onclick={donate} class="bg-white text-[#ff8400] hover:bg-[#ffb366]">
					<DollarSign class="mr-2 h-5 w-5" />
					Donate
				</Button>
			</div>
		</section>
	</main>

	<footer class="bg-gray-900 text-white py-8">
		<div class="container mx-auto px-4">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-4 md:mb-0">
					<Button variant="ghost" onclick={visitGithub} class="text-white hover:text-[#ff8400]">
						<Github class="mr-2 h-5 w-5" />
						GitHub
					</Button>
				</div>
				<div class="text-center md:text-right">
					<p class="text-sm text-gray-400">Created by</p>
					<p class="font-semibold">
						<User class="inline mr-1 h-4 w-4" />
						John Doe
					</p>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>