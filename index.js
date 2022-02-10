Vue.use(VueResource);

new Vue({
  el: '#app',
  data: {
    euros: '',
    taux: '',
    conversion:
      'Je ne peux pas vous donner une réponse avant que vous ne rentriez un nombre !',
  },
  watch: {
    euros: function () {
      this.conversion = "J'attends que vous arrêtiez de taper...";
      this.getConversion();
    },
  },
  methods: {
    getConversion: _.debounce(function () {
      if (!this.euros) {
        this.conversion =
          'Je ne peux pas vous donner une réponse avant que vous ne rentriez un nombre !';
        return;
      } else if (this.euros.search(/^[\d.,]+$/) === -1) {
        this.conversion = 'Ne tapez que des chiffres';
        return;
      }
      this.conversion = 'Je récupère le taux de change...';
      this.$http
        .get(
          'http://api.exchangeratesapi.io/latest?access_key=b4ebd934aa37ff19ccbd3ccf8e86f239&format=1',
        )
        .then(function (response) {
          this.taux = response.data.rates.USD;
          this.conversion = `${(
            this.taux * this.euros.replace(',', '.')
          ).toFixed(2)} $`;
        })
        .catch(function (error) {
          this.conversion = "Erreur ! Impossible d'accéder à l'API." + error;
        });
    }, 500),
  },
});
