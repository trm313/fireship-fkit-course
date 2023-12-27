<script lang="ts">
  import { userData, auth } from "$lib/firebase";
  import { signOut } from "firebase/auth";
  import SignInButton from "./SignInButton.svelte";
</script>

<header>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">daisyUI</a>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div class="navbar-end flex">
          {#if $userData?.username}
            <a href={`/${$userData?.username}/edit`} class="btn btn-primary"
              >Dashboard</a
            >
          {:else}
            <a href="/login" class="btn btn-primary">Get Started</a>
          {/if}
          <SignInButton />
        </div>
      </div>
    </div>
  </div>
</header>
