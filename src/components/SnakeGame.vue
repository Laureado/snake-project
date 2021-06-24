<template>
    <div>

        <div id="game" v-if="loaded" />

        <v-progress-circular
            v-else 
            indeterminate
            color="purple"
        ></v-progress-circular>

    </div>

</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Vuex from 'vuex';

@Component
export default class SnakeGame extends Vue.use(Vuex) {

    @Prop() private player!: string;

    loaded = false;
    gameInstance = {};

    async mounted(): Promise<void>{
        const game = await import('../game/game');
        this.loaded = true;
        this.$nextTick(() => {
            this.gameInstance =  game.launch(this.player);
        });

        
    }    

    checkSync():void{
        console.log("lol")
    }

}
</script>