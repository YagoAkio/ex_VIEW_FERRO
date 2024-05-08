const vapp = {
    data() {
        return {estado: "", municipio: ""}
    },
    mounted() {
        axios
        .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => { 
            let select = document.getElementById('estados_select');
            for(let i=0;i<response.data.length;i++){
                let option = document.createElement('option');
                option.value = response.data[i].sigla;
                option.text = response.data[i].nome;
                select.appendChild(option);
            }
        })
    },
    methods: {
        add_municipio() {
            axios
            .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + this.estado + '/municipios')
            .then(response => { 
                let select = document.getElementById('municipios');
                select.innerHTML = '';
                for(let i=0;i<response.data.length;i++){
                    let option = document.createElement('option');
                    option.value = response.data[i].nome;
                    option.text = response.data[i].nome;
                    select.appendChild(option);
                }
            });
        },
        ceps(){
            axios
            .get('https://viacep.com.br/ws/' + this.estado + '/' + this.municipio + '/Brasil/json/')
            .then((response) => { 
                let table = document.getElementById('tabela');
                table.innerHTML = `
                    <tr>
                        <th>CEP</th>
                        <th>Logradouro</th>
                        <th>Complemento</th>
                        <th>Bairro</th>
                    </tr>
                `;
                for(let i=0;i<response.data.length;i++){
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${response.data[i].cep}</td>
                        <td>${response.data[i].logradouro}</td>
                        <td>${response.data[i].complemento}</td>
                        <td>${response.data[i].bairro}</td>
                    `;
                    table.appendChild(tr);
                }
            });
        }
    },
    template:
    `
        <form>
            <select @change="add_municipio()" v-model="estado" id="estados_select"></select>
            <select @change="ceps()" v-model="municipio" id="municipios" ></select>
            <input @change="ceps()" type="text" v-model="referencia" ><input>
        </form>
        <br>
        <table id="tabela">
        </table>
    `
};

Vue.createApp(vapp).mount('#app')
    