# Manifestos e evidências de entrega

Uma entrega que cruza repositórios precisa identificar exatamente o conjunto validado. Sem submódulos, essa composição é registrada por SHA e PR, não por gitlinks.

Quando houver uma entrega autorizada, crie uma pasta `<delivery-id>/r<N>/` com seu manifesto e evidências sanitizadas. Use [manifest.example.json](../templates/manifest.example.json) como roteiro documental; ele não é uma entrada executável nem substitui o contrato do workflow adotado.

O manifesto registra a branch recebida (`input_branch`), o commit dos materiais (`source_context_commit`), `input_path=inputs/<delivery>/` e os paths/hashes das fontes consumidas. O commit de entrada permanece distinto do commit de Planning aprovado para execução dos produtos.

O manifesto referencia os requisitos, o plano e as revisões em `plans/<delivery>/r<revision>/`; `specs/` é histórico de consulta. Ele registra intenção e revisão, artefatos aprovados e commit de Planning consumido, entradas e candidatos por repositório, dependências, gates, resultados, PRs e pendências. Credenciais, portas privadas, dumps, identificadores reais e respostas de provider não pertencem a ele.

O arquivo de exemplo está em `intake`, com SHAs nulos e listas vazias. Ele não pode iniciar execução. `ready` exige resolver os campos obrigatórios e comprovar os gates do plano; listas vazias não são sucesso automático.

Estado de negócio proposto: `registered → planning → ready → executing → integrating → validating → validated-local → publishing → published-prs`. Investigações podem concluir com relatório sem publicar mudança de produto. Falha, bloqueio e cancelamento são resultados explícitos, não passagem automática de gate.

Para uma alteração, `published-prs` exige PRs OPEN nos repositórios proprietários dos entregáveis, branch/SHA/base verificados e auto-merge desligado. Não depende de merge; agentes jamais fazem merge ou push na base. Se houver falha de publicação, a entrega continua incompleta.

Logs, receipts e estado operacional da ferramenta de execução podem conter mais detalhes. Preserve a separação entre registros versionados para revisão e estado mutável de execução; este template não substitui os contratos operacionais da ferramenta adotada.
