<template>

    <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
      class="my-4"
    >
      <v-container class="py-0 fill-height">

        <h2>
          {{name}}
        </h2>
       
        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-form
             @submit="checkForm"
             v-if="!valid"
          >
            <v-text-field
              v-model="formName"
              class="pt-2"
              clearable
              :append-outer-icon="'mdi-send'"
              label="Insert name"
              maxlength="20"
              required
              @click:append-outer="checkForm"
              :error="nameValid"
            ></v-text-field>

          </v-form>
        </v-responsive>


      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list color="transparent" class="text-center">

                <v-list-item
                  color="grey lighten-4"
                >
                  <v-list-item-content>
                    <v-list-item-title class="text-h5 text-center">
                        TOP 10
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="my-1"></v-divider>

                <v-progress-circular
                          v-if="loading" 
                          indeterminate
                          color="purple"
                ></v-progress-circular>

                <v-simple-table 
                  v-if="!loading"
                  dense
                >
                    <thead>
                        <tr>
                        <th class="text-left black--text" style="font-size: 15px">
                            Name
                        </th>
                        <th class="text-left black--text" style="font-size: 15px">
                            Score
                        </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr class="text-left"
                            v-for="(rank, index) in ranks" 
                            :key="index"
                        >
                        <td>{{ rank.Name }}</td>
                        <td>{{ rank.Points }}</td>
                        </tr>

                    </tbody>
                </v-simple-table>

                <v-divider class="my-1"></v-divider>

                <v-list-item
                  link
                  color="grey lighten-4"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                        <v-btn
                            @click="refreshRank"
                            block
                            :disabled="loading"
                            class="white--text"
                            color="deep-purple accent-4"
                        >
                            Refresh
                        </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              class="d-flex align-center justify-center"
              min-height="70vh"
              rounded="lg"
            >
              
              <p 
                class="text-h4 text--primary" 
                v-if="!valid" 
                align="center"
              >
                Please, insert your name
              </p>

              <div 
                v-else
                align="center"
              >
                <SnakeGame v-bind:player="name" />

              </div>

            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


import SnakeGame from './SnakeGame.vue'
import { IRank } from '../models/Ranks';
import { RankApi } from '../helpers/RankApi';


@Component({
    components: {
      SnakeGame
    }
  })
export default class SnakeApp extends Vue {

    private ranks: IRank[] = [];
    private loading = true;
    private valid = false;
    private formName = "";
    private name = "";
    private nameValid = false;

    async getRankTable(): Promise<void>{
        this.ranks = await RankApi.getTopRank();
        this.loading = false;
    }

    refreshRank(): void{
        this.loading = true;
        this.getRankTable();
    }

    checkForm(e: any): void{
      e.preventDefault();
      
      if(this.formName.length > 0){
        this.valid = true;
        this.nameValid = false;
        this.name = this.formName;
        this.formName = "";
      } else {
        this.nameValid = true;
      }

    }

    async mounted(): Promise<void>{
        this.getRankTable();
    }

}
</script>
