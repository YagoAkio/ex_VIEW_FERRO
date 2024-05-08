const vapp = {
    data() {
        return {estado: "", municipio: "", referencia: ""}
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
                select.value = '';
            });
        },
        ceps(){
            if(this.municipio!='' && this.estado!='' && this.referencia.length>2){
                axios
                .get('https://viacep.com.br/ws/' + this.estado + '/' + this.municipio + '/'+ this.referencia +'/json/')
                .then((response) => { 
                    let table = document.getElementById('tabela');
                    table.innerHTML = `
                        <tr>
                            <th scope="col">CEP</th>
                            <th scope="col">Logradouro</th>
                            <th scope="col">Complemento</th>
                            <th scope="col">Bairro</th>
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
        }
    },
    template:
    `
        <form style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    padding: 20px 50px;
                    "
        >
            <select @change="add_municipio()" v-model="estado" id="estados_select" class="form-select" aria-label="Default select example">
                <option selected>Estados</option>
            </select>
            <select @change="ceps()" v-model="municipio" id="municipios" class="form-select" aria-label="Default select example">
                <option selected>Municipios</option>
            </select>
            <input @change="ceps()" v-model="referencia" class="form-control" type="text" placeholder="Referencia" aria-label="default input example">
        </form>
        <br>
        <table class="table" id="tabela">
        </table>
    `
};

Vue.createApp(vapp).mount('#app')
    