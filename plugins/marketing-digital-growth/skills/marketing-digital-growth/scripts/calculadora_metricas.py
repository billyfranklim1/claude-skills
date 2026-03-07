#!/usr/bin/env python3
"""
Calculadora de Metricas de Marketing Digital
Uso: python3 calculadora_metricas.py --modo [roas|cpa|ltv|budget|funil|breakeven|projecao]

Exemplos:
  python3 calculadora_metricas.py --modo roas --receita 5000 --investimento 1000
  python3 calculadora_metricas.py --modo cpa --investimento 3000 --conversoes 50
  python3 calculadora_metricas.py --modo ltv --ticket 150 --frequencia 4 --meses 12
  python3 calculadora_metricas.py --modo budget --meta-vendas 100 --cpa-meta 30
  python3 calculadora_metricas.py --modo funil --impressoes 100000 --cliques 2000 --visitas-lp 1800 --leads 90 --vendas 15
  python3 calculadora_metricas.py --modo breakeven --preco 200 --custo-produto 80 --cpa 40
  python3 calculadora_metricas.py --modo projecao --investimento 3000 --cpa-atual 25 --ticket 150 --margem 60
"""

import argparse
import json
import sys


def calcular_roas(receita: float, investimento: float) -> dict:
    """Calcula ROAS e metricas relacionadas."""
    roas = receita / investimento if investimento > 0 else 0
    lucro_bruto = receita - investimento
    roi_percentual = ((receita - investimento) / investimento * 100) if investimento > 0 else 0

    resultado = {
        "metrica": "ROAS (Return on Ad Spend)",
        "investimento": f"R$ {investimento:,.2f}",
        "receita": f"R$ {receita:,.2f}",
        "roas": f"{roas:.2f}x",
        "lucro_bruto_ads": f"R$ {lucro_bruto:,.2f}",
        "roi_percentual": f"{roi_percentual:.1f}%",
        "interpretacao": "",
    }

    if roas < 1:
        resultado["interpretacao"] = (
            f"CRITICO: Voce esta PERDENDO dinheiro. Para cada R$1 investido, "
            f"volta apenas R${roas:.2f}. Precisa otimizar urgentemente ou pausar."
        )
    elif roas < 2:
        resultado["interpretacao"] = (
            f"ATENCAO: ROAS de {roas:.2f}x pode nao cobrir custos operacionais. "
            f"Considere que alem dos ads, voce tem custo de produto, equipe, etc."
        )
    elif roas < 4:
        resultado["interpretacao"] = (
            f"BOM: ROAS de {roas:.2f}x esta saudavel para a maioria dos negocios. "
            f"Considere escalar gradualmente (aumentar 20% do orcamento)."
        )
    else:
        resultado["interpretacao"] = (
            f"EXCELENTE: ROAS de {roas:.2f}x e muito bom! Escale essa campanha. "
            f"Aumente orcamento em 20-30% e monitore se o ROAS se mantém."
        )

    return resultado


def calcular_cpa(investimento: float, conversoes: int) -> dict:
    """Calcula CPA e analisa viabilidade."""
    cpa = investimento / conversoes if conversoes > 0 else 0
    cpc_estimado = investimento / (conversoes * 20) if conversoes > 0 else 0  # estimando 5% conv rate

    return {
        "metrica": "CPA (Custo por Aquisicao)",
        "investimento": f"R$ {investimento:,.2f}",
        "conversoes": conversoes,
        "cpa": f"R$ {cpa:,.2f}",
        "cpc_estimado": f"R$ {cpc_estimado:,.2f} (estimativa)",
        "interpretacao": (
            f"Cada conversao esta custando R$ {cpa:.2f}. "
            f"Para saber se e bom, compare com seu ticket medio e margem. "
            f"Se seu produto custa R$ X e sua margem e Y%, "
            f"o CPA precisa ser menor que R$ X * Y% para ter lucro."
        ),
    }


def calcular_ltv(ticket_medio: float, frequencia_ano: float, anos: float) -> dict:
    """Calcula LTV e relacao com CAC sugerido."""
    ltv = ticket_medio * frequencia_ano * anos
    cac_maximo = ltv / 3  # regra de ouro: LTV >= 3x CAC

    return {
        "metrica": "LTV (Lifetime Value)",
        "ticket_medio": f"R$ {ticket_medio:,.2f}",
        "compras_por_ano": frequencia_ano,
        "tempo_anos": anos,
        "ltv": f"R$ {ltv:,.2f}",
        "cac_maximo_sugerido": f"R$ {cac_maximo:,.2f}",
        "interpretacao": (
            f"Um cliente vale R$ {ltv:,.2f} ao longo de {anos:.0f} ano(s). "
            f"Usando a regra LTV >= 3x CAC, voce pode gastar ate "
            f"R$ {cac_maximo:,.2f} para adquirir cada cliente e ainda ter lucro saudavel."
        ),
    }


def calcular_budget(meta_vendas: int, cpa_meta: float) -> dict:
    """Calcula orcamento necessario baseado em metas."""
    budget_mensal = meta_vendas * cpa_meta
    budget_diario = budget_mensal / 30

    # Margem de seguranca: +20% para fase de aprendizado
    budget_com_margem = budget_mensal * 1.2

    return {
        "metrica": "Calculo de Orcamento",
        "meta_vendas_mes": meta_vendas,
        "cpa_meta": f"R$ {cpa_meta:,.2f}",
        "orcamento_mensal": f"R$ {budget_mensal:,.2f}",
        "orcamento_diario": f"R$ {budget_diario:,.2f}",
        "orcamento_com_margem_20pct": f"R$ {budget_com_margem:,.2f}",
        "interpretacao": (
            f"Para {meta_vendas} vendas/mes com CPA de R$ {cpa_meta:.2f}, "
            f"voce precisa de R$ {budget_mensal:,.2f}/mes (R$ {budget_diario:,.2f}/dia). "
            f"Recomendo reservar R$ {budget_com_margem:,.2f}/mes (+20%) para cobrir "
            f"a fase de aprendizado e testes iniciais."
        ),
    }


def calcular_funil(impressoes: int, cliques: int, visitas_lp: int, leads: int, vendas: int) -> dict:
    """Analisa o funil completo e identifica gargalos."""
    ctr = (cliques / impressoes * 100) if impressoes > 0 else 0
    taxa_bounce = ((cliques - visitas_lp) / cliques * 100) if cliques > 0 else 0
    taxa_conversao_lp = (leads / visitas_lp * 100) if visitas_lp > 0 else 0
    taxa_fechamento = (vendas / leads * 100) if leads > 0 else 0
    taxa_geral = (vendas / impressoes * 100) if impressoes > 0 else 0

    # Identificar gargalo
    gargalos = []
    if ctr < 1.0:
        gargalos.append("CTR baixo (< 1%) → Problema no CRIATIVO ou PUBLICO. Teste novos criativos e segmentacoes.")
    if taxa_bounce > 30:
        gargalos.append(f"Bounce alto ({taxa_bounce:.0f}%) → LP lenta ou nao-responsiva. Otimize velocidade e mobile.")
    if taxa_conversao_lp < 3:
        gargalos.append(f"Conversao da LP baixa ({taxa_conversao_lp:.1f}%) → Problema na OFERTA ou LANDING PAGE.")
    if taxa_fechamento < 10:
        gargalos.append(f"Taxa de fechamento baixa ({taxa_fechamento:.1f}%) → Problema no processo de VENDAS ou QUALIFICACAO.")

    return {
        "metrica": "Analise de Funil",
        "etapas": {
            "impressoes": f"{impressoes:,}",
            "cliques": f"{cliques:,} (CTR: {ctr:.2f}%)",
            "visitas_lp": f"{visitas_lp:,} (bounce: {taxa_bounce:.1f}%)",
            "leads": f"{leads:,} (conv LP: {taxa_conversao_lp:.1f}%)",
            "vendas": f"{vendas:,} (fechamento: {taxa_fechamento:.1f}%)",
        },
        "taxa_geral": f"{taxa_geral:.3f}%",
        "gargalos_identificados": gargalos if gargalos else ["Nenhum gargalo critico identificado. Funil saudavel!"],
    }


def calcular_breakeven(preco: float, custo_produto: float, cpa: float) -> dict:
    """Calcula break-even e margem apos ads."""
    margem_bruta = preco - custo_produto
    margem_bruta_pct = (margem_bruta / preco * 100) if preco > 0 else 0
    lucro_por_venda = margem_bruta - cpa
    roas_breakeven = preco / (preco - custo_produto) if (preco - custo_produto) > 0 else 0
    cpa_maximo = margem_bruta

    resultado = {
        "metrica": "Analise de Break-Even",
        "preco_venda": f"R$ {preco:,.2f}",
        "custo_produto": f"R$ {custo_produto:,.2f}",
        "margem_bruta": f"R$ {margem_bruta:,.2f} ({margem_bruta_pct:.1f}%)",
        "cpa_atual": f"R$ {cpa:,.2f}",
        "cpa_maximo_para_lucro": f"R$ {cpa_maximo:,.2f}",
        "lucro_por_venda_apos_ads": f"R$ {lucro_por_venda:,.2f}",
        "roas_minimo_breakeven": f"{roas_breakeven:.2f}x",
        "status": "LUCRATIVO" if lucro_por_venda > 0 else "PREJUIZO",
        "interpretacao": "",
    }

    if lucro_por_venda > 0:
        resultado["interpretacao"] = (
            f"Com preco de R$ {preco:.2f} e custo de R$ {custo_produto:.2f}, "
            f"sua margem e R$ {margem_bruta:.2f}. "
            f"Seu CPA de R$ {cpa:.2f} esta dentro da margem. "
            f"Lucro de R$ {lucro_por_venda:.2f} por venda. "
            f"CPA maximo permitido: R$ {cpa_maximo:.2f}. ROAS minimo: {roas_breakeven:.2f}x."
        )
    else:
        resultado["interpretacao"] = (
            f"Com preco de R$ {preco:.2f} e custo de R$ {custo_produto:.2f}, "
            f"sua margem e R$ {margem_bruta:.2f}. "
            f"ATENCAO: CPA de R$ {cpa:.2f} esta acima da margem! "
            f"Voce perde R$ {abs(lucro_por_venda):.2f} por venda. "
            f"CPA maximo permitido: R$ {cpa_maximo:.2f}. ROAS minimo: {roas_breakeven:.2f}x."
        )

    return resultado


def calcular_projecao(investimento: float, cpa_atual: float, ticket: float, margem_pct: float) -> dict:
    """Projeta resultados para diferentes cenarios de orcamento."""
    margem = margem_pct / 100
    vendas_estimadas = investimento / cpa_atual if cpa_atual > 0 else 0
    receita = vendas_estimadas * ticket
    lucro_bruto = receita * margem
    lucro_liquido = lucro_bruto - investimento
    roas = receita / investimento if investimento > 0 else 0

    cenarios = []
    for multiplicador, nome in [(0.5, "Conservador (-50%)"), (1, "Atual"), (1.5, "Otimista (+50%)"), (2, "Agressivo (2x)")]:
        inv = investimento * multiplicador
        cpa_ajustado = cpa_atual * (1 + (multiplicador - 1) * 0.15)  # CPA sobe ~15% a cada dobro
        v = inv / cpa_ajustado if cpa_ajustado > 0 else 0
        r = v * ticket
        lb = r * margem
        ll = lb - inv
        cenarios.append({
            "cenario": nome,
            "investimento": f"R$ {inv:,.2f}",
            "cpa_estimado": f"R$ {cpa_ajustado:,.2f}",
            "vendas_estimadas": f"{v:.0f}",
            "receita": f"R$ {r:,.2f}",
            "lucro_liquido": f"R$ {ll:,.2f}",
            "roas": f"{(r/inv if inv > 0 else 0):.2f}x",
        })

    return {
        "metrica": "Projecao de Resultados",
        "parametros": {
            "investimento_base": f"R$ {investimento:,.2f}",
            "cpa_atual": f"R$ {cpa_atual:,.2f}",
            "ticket_medio": f"R$ {ticket:,.2f}",
            "margem": f"{margem_pct:.0f}%",
        },
        "cenarios": cenarios,
        "nota": "CPAs tendem a subir 10-20% ao escalar. Projecoes incluem esta estimativa.",
    }


def main():
    parser = argparse.ArgumentParser(description="Calculadora de Metricas de Marketing Digital")
    parser.add_argument("--modo", required=True, choices=["roas", "cpa", "ltv", "budget", "funil", "breakeven", "projecao"])

    # ROAS
    parser.add_argument("--receita", type=float, help="Receita total gerada")
    parser.add_argument("--investimento", type=float, help="Investimento em ads")

    # CPA
    parser.add_argument("--conversoes", type=int, help="Numero de conversoes")

    # LTV
    parser.add_argument("--ticket", type=float, help="Ticket medio")
    parser.add_argument("--frequencia", type=float, help="Compras por ano")
    parser.add_argument("--meses", type=float, help="Tempo em meses de relacionamento")

    # Budget
    parser.add_argument("--meta-vendas", type=int, help="Meta de vendas por mes")
    parser.add_argument("--cpa-meta", type=float, help="CPA meta")

    # Funil
    parser.add_argument("--impressoes", type=int, help="Total de impressoes")
    parser.add_argument("--cliques", type=int, help="Total de cliques")
    parser.add_argument("--visitas-lp", type=int, help="Visitas na landing page")
    parser.add_argument("--leads", type=int, help="Leads gerados")
    parser.add_argument("--vendas", type=int, help="Vendas realizadas")

    # Break-even
    parser.add_argument("--preco", type=float, help="Preco de venda do produto")
    parser.add_argument("--custo-produto", type=float, help="Custo do produto")
    parser.add_argument("--cpa", type=float, help="CPA atual")

    # Projecao
    parser.add_argument("--cpa-atual", type=float, help="CPA atual para projecao")
    parser.add_argument("--margem", type=float, help="Margem de lucro em %")

    args = parser.parse_args()

    if args.modo == "roas":
        resultado = calcular_roas(args.receita, args.investimento)
    elif args.modo == "cpa":
        resultado = calcular_cpa(args.investimento, args.conversoes)
    elif args.modo == "ltv":
        resultado = calcular_ltv(args.ticket, args.frequencia, args.meses / 12)
    elif args.modo == "budget":
        resultado = calcular_budget(args.meta_vendas, args.cpa_meta)
    elif args.modo == "funil":
        resultado = calcular_funil(args.impressoes, args.cliques, args.visitas_lp, args.leads, args.vendas)
    elif args.modo == "breakeven":
        resultado = calcular_breakeven(args.preco, args.custo_produto, args.cpa)
    elif args.modo == "projecao":
        resultado = calcular_projecao(args.investimento, args.cpa_atual, args.ticket, args.margem)

    print(json.dumps(resultado, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
