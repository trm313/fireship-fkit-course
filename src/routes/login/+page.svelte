<script lang="ts">
  import { auth, user } from "$lib/firebase";
  import SignInButton from "$lib/components/SignInButton.svelte";
  // import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

  // async function signInWithGoogle() {
  //   const provider = new GoogleAuthProvider();
  //   const user = await signInWithPopup(auth, provider);
  //   console.log(user);
  // }
</script>

<h2>Login</h2>

<SignInButton />
{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You are logged in</p>
  <a href="/login/username" class="btn btn-primary">Proceed to Username</a>
{/if}
<!-- 
{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You are logged in</p>
  <a href="/login/username" class="btn btn-primary">Proceed to Username</a>
  <button class="btn btn-default" on:click={() => signOut(auth)}
    >Sign Out</button
  >
{:else}
  <button class="btn btn-primary" on:click={signInWithGoogle}>
    Sign in with Google
  </button>
{/if} -->
