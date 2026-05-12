'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa ambos capos para continuar.');
      return;
    }

    try {
      setLoading(true);
    
      const loggedUser = await login({ email, password });
      const nombreRol = loggedUser?.rol?.nombre_rol?.toLowerCase();

      if (nombreRol === 'alumno') {
        router.push('/mis_calificaciones');
      } else {
        router.push('/dashboard');
      }
    
    } catch (err) {
      setError('Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  }

  function handleEmail(value: string) {
    setEmail(value);
    if (error) setError('');
  }

  function handlePassword(value: string) {
    setPassword(value);
    if (error) setError('');
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-10">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAADsCAMAAAA/3KjXAAAAzFBMVEX///8BLW4AKWz///0AK20ALW0AJmsAKGwAIWkAH2gAJGoAGWYAI2oAHmgAHGcAGGYAAF4AE2PY3ucnSH54iaQALmzm7O4qQXnu8/QAEGMcPXhbcJYABWBRYorZ4OOQn7azwM90haIAC2IAAGKhrb+qtsPM1N4yTIJPaJLAydU3UH+ElK7s8PMAG2q5ws5xgaRDWodec5WQnbNAWoObqLwAM28uSH4AAFbQ2t4YPXEVPno4WYVLZYwtSnoAFmpid59ldJt7kKd3gKAAM2pPjOwVAAAgAElEQVR4nO1dC3uiyNKGprnfRAVBE7wEmSDEW3RWd3R2c+b//6evqgHFW2a+syeL8zyp3WdiImi/VHV13bqa4/43JHBJb9+6oEnECcL/6CtqoUHDoFQ8JUrpA+Cqe2j/hHoSf42k17oH9o/I75KrsKhb98j+EYXBVVQ8VTd1D+2fUGSK13Hp47qH9k9oaFxHxUvDuof2T2hyfWrxPGlduXqT/esD/K8o02/IIM+73vnFm+3DaPFbAJs6t1BRKzm7NpE10VXc8z/fI6XqLVi8uTxdkAcKk1fy8Mbd+0otPGs3YUnzk0sjq5yF1qRZ03B/lfw1vQmLdP3KlUv9eKWkru6bX83RTVQ81UqmAIRUP3kv6F3okzsir63chsWraT52QDXTz7iqbqc1j/0G+XE6VxX3HViiYszTGCQx61kXb8pW278z1SFwQjOd2OZ12/1k8Io9SeNn88pb1Jo37wuWt5rrikxva4sKubJi3dCWkrS6J34lki3/EqSfEbXvSXMMvv9PQCEp3bhuNAca6D8f76+SMb8bKbwCC+MXRAaSZEL5m9bvJYnbuzF9z2FRSbGcQPpzPweatFw7sFXtlr9yRtJj3WgOdAaLthbpOPYy3wfFz/m+nzXHy0VnZGs/n4KiPagbzYFOYdH1t1l/Gof+6UW+F83WjvITZKTlX/+OGuhcCGXN1C25OxmOT9Wa4CdD6kjvzTR7VROGK3RdExLZsI1ubxyeXOuPX0e3jRGyvqd165aCd0Vi6NIkwrHmoWr4R4h7o1scU4d3ZGX8ZN2SLOk5OQnAb3ajq4qRKvezGP/CckwlfRtxJceQIUnHvvYA7ke7c79mZRDLXVU5JvS/yxeSaN+Vz/UrsKhIrTXGdQ/Ywv157E1u3VWu6FdtQvp9X507Qjs4XcX0O9LuQIMnRTEMSQaPC5jyHjB59Hd1uR3YVc1BundjDjLyhsP27K/n+ZetrDu2reuWIpEbTqUmDyp3hnzFoyTr8NY31EGnE8JrJoPVcL62LN3UZPFCLdBgUTIM7vP3lZiOtr8fy4lDn38VjceD5MQOFMJp/9lVdIWcs81cV2aY8FqJa1iLf3/wt2n1ZOm6bTvBqBGIX3ppNGiWHGxOh131RTqRSFF2swqHH4+4xKpJWLtSjEYyKXhCqSyplj1yWrNVyZMweqWArCKHVr9yt/B6kENwPY9ha0DueXVia/bmX9eiYeqqBspQ5FG9EUUPrF0/FthT98ZzzTxII5Vbvo8jLgbdOmb6tDmgyeLBKl3M18D9b/XNtlygsjAeLBeTrajqRhlbk6wRaRdXNdOufohPOQOuNVmVQ87Eo57X9n+qo8C24AnhY3iZ1YMJKe6lq2mpLrw4mk1c1ZQQA+GVDeAepOkAsI8nllwMvsetAvtl2MyZ2bQPIirKMhZyHH616oMVjUyYTnb3cdgfhD6OM4v7u65lylQHCzfeOqb60MVEf/KosklGaRbylFeDRb5UjYMbngoN6kvqRbbLwwOmkmLaI2UyXCaIzY/be1WCeU9gyVWfHzWPme6PKkqcM+VeZfRE7CX7iNm18DXCMupLpCe2YxlSqRHA5XesSXuMOqE5yEeswRTpDXMdkUwskM0298YUINX3KKb+Vr6BS60NltBMVot5V7FVFltCxsmmrk9QwwucC39TgCftNfB1BWafEHVM7VFICgNZswZwVRzcMCZrlEJG2WbQftwqtlEsUbQRc68DjsNfXXnVV9Y+t2y4bViZ/FRa+81SrdMRLsLDG0lnpTYp3PTScZjHVvzmeDZ3bQWxjDIf1XuXoDowLakFHFOoqSxgMWvuPO+QjxUDUCyZe11r0Np04SpQnMCdD/uJx1wLL2kDNKOR+WuAkr7kqTxQDsIe1IWr2BjagOl0XK0CcIuj66UP9enCvsUzPWgFaquXDtgK5g1m3ZjrjBLO7xjIFvWLnxdtiCLV9EcYa+uoJQgBZk+ua43adOH4EG6hRFJtq9VbxjBM3+d6SsfnvN533dZ7Hpd1DgM3GiHXqfiQxg6cyuu1bVSrB5XQ1G2jMkRKNDNYP6ZxJox1ZQe8a44xCJo9Hm0/0fGyauEh1ac3y6WceqRQELxosXaMEw1NiOL86ftbanTycJIw7VQ8Ripm4Ul8gHwBrjtXtYZaY2lbNp1tHbXiWMEInRWOVLInw1V/NrFJZdDyFyG2TpwwC2bhn1dnF5VqQST47QTVO1hLE9uqZHto1+cWsOjKhgoG+QknYDWKTu1AY3GzYEqvRwqjhrNmrhW4jKseHyjlHFHRZgJ+KaruOMHDKHDA48BpKIIJPJ7rFjkuVhRW6+b1yFxNunCo8MR4UfeLAdrjfpLOFcfUwEakdoTFTa1ZGiVNz/NC5h+2HF2yQ4x29PfBgbnUAFvr8boU0hpACVyPRcUoMXQ6GU4LaIuOFThOA/QFc1U4H2CVLlm023ObNpqMyS6QisIbfQAL+8tVdl1UIv4rsBYHxQ3QLLKfjTdY5+OHyTTxYcpFs/l+212v193O5Lk9AKNQyLh0ZOyX4EXG88LIVcEcDs9LoXKqxy48rd8CaLay/rJY4vj9Qa+r6uC1AFFKqCxZD4E4BI7ODZ40kAtCpEvl2IX51ZQemdQBa3VRmAUItMbM99K1LZ2Gr1+M4SADsfTWoCxGGyyX4po/EIyCYYu3q7rQ2tUBa6rnUEQqGYqqmkCKRabc8vuTbZlGJZYmKX2cX348XapgRvLFB3ioD9WUu17qK9r1RLHDhhOMntT1ft4bttPlilHIxdF4HEXL4av8UPDAmuD4woWoqqpoWA9p+QloDmLYg/OsC0PDCJa1xEIFbgDq++QP/sk4hOZS18Ds0FksetpoWKbEk7+WqX+4ak2oiZrR35+qeJE+PNeXJffi6Xg17M2//OlKGpBhaJokkXV3P0lz9T5XqNKDF3E7yabpcqFjaOYQshYWEu2yV4vTTQ/2n/X5/OHIsjD7o0mY4YJJxohFrrW5wEXPvQHH7Q2sQJ46xvOYE966ZCsIR5YKC8XKJbKiVUVeCvo1RquX1o3wCk8dj3t9ajQaQy7+A557MhLp6yr2eNENTnbSdI11LpHRUauSp0VWZ4JheLPuWHvmoqee7+2fYg6UdIbhedl0XvBHtcIuCvQiEZHYhc6gRqvmnVGpSQ+Cd0qgtHuNzeMubqwETxBOokujSpar0S1VeLN0keVd3bmgpKEimebLiwX/qYYhFxAB1qIRr6JBA7V3dmKgV+3y47rklQEEre4UHuahMqyv85rNOBmMl8PnFjFMzLFKc276sE+mdIQDj+zqoiSuq7nL8oVXCrS0qztvB14/wAGaJnFYZOt98EEWWxmsvvZDo+FEXAgm8WlFdZBckTKvlGSp7upWIW6MnO+27QAFwUPDniRxGjFWZPFY4EAIweQAmdqfhmDU5ZUP88R7gYUBtYOykF8mU78dPPW5WN5PubhYcaMA1mL3VKVcdTfuh1uVKhpifZlyg7Vlp5y/NSwvdJzXFOZc2JDBtzjdLUTNq7BKQT3bFlUDlbCI1Yk47zmg5gJcZlMbcqlFtfU02qWpJXJC1d7TVGt0bWurVzqS0nPduX4GS+QVtw++lybxyiOsZbbrxBi4JZPp34OGZ4DjXlm2pVl/DAJ6OfDDuiXK7ZprhRAWNYyZx8UTh/Kk5XFTlSd7LjYpLKvJyG/0B43/VKLR9MetDH5ycLioKq5qraoBWMR+jZFFEkYrY87rElyK2yoKU/LHZmb7C8cTDuFp6t5yDKOqp23v6ywwHNgmlgomLRRG11pxXE/hqd1kGl3qxUHPa/SE+YIbBzkuSie3nKj0xL6Ug8dNbTNsMBpmnD90UCOIJixQfUfk5W9CU2KwPH3ktZ9S/3HMtfNKBfJ6U7rOlmwqWbOappjgg0RNu7n0kE4GKxZli+1YzzWapT0L62Doh4KQmpqI1Xe3mOVfJLlgivX9OjiGxQrDQM6jmGYCQ9MoLzrN3NOV59yfdJTEgcW893in2crr+NY4M+MyaUL1VliLJMadMrJitYtNqmTvc2ydIi0QLHntr0ZKFy0qIYyi24NMrmZazTqWZiFUyqClNPG5hG2TVtpc6OYFM6DdRGPHpSNqfU2TMMv889LKI13PmUjk30WU09+l9iJGXMaOHLAHc+NjxJZY+417C3hZdaRut9u/WUH9eDWqK23/VTw5+Yc8JIZZ3opYqFcGe0ceh2mR731u9V3GDRoieVncWLa869tPlPb1yz+UkpdiYkkwn2KVFdLIj4eMg1NYTfaSSzomewLUkOezlJmEwLfmarHb9YbRxr9Vem7WEVUbF2PBAGaRG3BN4FuRJnhZcQlaTaI1w/IZnQAreVFrbGOmRAdzy8Jyc8UyO4v51RAWIXUowmKaUxVEZVVktR2sx8jHiEEJlpyjyhcwq5bfdMcOgj2z9wRvoR9C9JQY1zfUqLM6jPlZrjEwS+ppZcmuVyhCWLhERI4DFiUDrXIvGSRhEc5e3qrgqsLSp3XA+ovZO2xX46LQifIEZ1n+Whw1Oe+pnCXr9jGONo2Kqfg+EeXfxwQ0Y7CUBS6mhfIwZsecjvgSHfGCJEr7WZQkSbTY2muB+4Ud81qvFlhDhEVVjxNah34lq0oyD3OJ4cNRpoih25atG4Q+ZLcbDR2ppgZRfRMrEvpHfcHzQVxNEjx4wlm5YF5jjOK5uNUW6vgYnHqcSVTw2MTJP/YrkL1qVBC1fWZckbYHj3u3bwgj6Vs9QY3kBQaI7DkwRN6DK3G0g1wTwY8uOoQgH9Kfcuulpg6AmUoxnV3pCWfgJJ8fPaeXlcA85jMie1D9tzsNFdSoKxu5l2wQ/97xuStD8C2/HpQBpRrYSP763ODD+OfNlmslydd6lP0rtMJ8SHzUdUwRZt3KZLLe4LLYOZteNqi41581erFq21koYHi2UigiYmGjV43h0gB3+kyfTrQ51YDHNwqPj/RQ6xa8ZFRB4cBQmnwVltTFaT94qPILg9XNn/Yu+FEnKm5fnfpgEXLhqS6wFuiDJJV9XFT3rhXgnJF5La3yr9F0VBEmjD5xm1M+iA4bX9g6FGux3SWXjUI1XddVg+1ywv//qLG9mnA6PJbsiM/4QJ2INYRKXxT2BNRXEMvootBOWcSDKF3MO6JmWpY+Sn/65R9Ip7XeEqsrOd+0T4IVewLhzHiRiA02PuddbHSt7D32w3g6rrd1QeskaMmy2fF5aEykTjtPEnvRbotRGv9VO7M8RGvAPq8SwqkxG5Sc9rljacYLWEAvr1VtHU7O7Q7xnvplCNzkdE1F0/ZqIFPUWDsx3OwphG1TOueV/OWe9lPHzqk+Y4ZBcq0hBu5Ci0HP7+Zd5yLQKZJ1femRK/R81umINTW6HnYGhbjCFIt8zXuU2vcjgjBH7DNLgW1NugFLtOKbizD9ek8yODuf+Q7WYF1TGTwa5H4Z/bgC+Z76P19YCjpaBjdgoTqp+CynVH8tRoWiM+VAVVTjF8txzixshTy4vvOHZ1HpuwEmPJ4pNQlhbS6LiVER4tkE8xubcXkKbvXdwAJr4URpUIrJw2suB7MzuOh2W2tRu6fGwUJKzeN0oTzbSX05f4jexjfEd0KDao2tCa6Ql+4dy8DVSBTpGmGF/Bm3ioZI/uS9oMztgo1aCOzWTR/dCdN2HMYt76AgUeSoZMlDtndt935gUK3VEzmhODp0vsBNWiHrSeJvcQeX6IoykQxLny895pXMb3cgzwW1m92L0pg2vkYXwTyhPd8S3XEssfU4jPIKBGHa/WlH4fvpYTXVZbvbZuXdJ7luH5nnZYyVrPfCo/XzRELtpccHwh1BxFQnafxOADYbvyo/b/6cV3bcBxUbnWTVWk92s+FwsZv0TwGGg0XX/hVQoC/v5riTaXXzu2HiphnL3fWTOAzDZpysFhMXlP8vdUqWpMHddL2L9aNFURoQVDJ1zP0Qxf5VSGjC39XxBN7w4VoOmG3PuPi7KFvBdXkkzvCeHC6gsK3Z73aWLSBRSR3tV83dNfPeMAZ1w7gkf7wwA/MnClwdtZYoZsLwwhuj9re7spsqlCy/vItLfTsoyPS0IEMUR+17URVX6EYEIyfZqCjv1YkzY6i1lJT8KmU3N94hS04OMhlYlSzs/I66H18h4dstz5dn9a1VirVCIdJGes+sQrq9oRCm1pld5K0NV+Rdw77/w4+id/JwF92A/ckLlZ35nS1W16j5cPuAFnKpwdvr1t04Iu+Q4G9v6gzSvbyc/XPn84pR72aoQnq8d8XwDvVvevXnx4r9VnRzQb48BO53ouymt3hfsbL/J90MRV/RGL8TrYKLds4MVdD/+b33TMsOOP/nJHd/c1RYUdG8JP83VoOf9Emf9Emf9Emf9FvSPZ1N9T8jwWv8Bm7YTbuv2jHthL71qsdXXXYGwRsPfxWuXHCXJJxE035pyB+DK6uY5QIXHgx0/Lr4bdfDBv1c2VsALs7YSJrL57+ivGo6zP/GyI8WvTQsQ1BcFi12MxZNFOAzcwjNdPfMcrb4+e3n2eBDUHGRXnZMo08Z15HYqzwwO7RUTdPdiMvWRaYg+o6tdXErqwXv/GAjfjTsvG5Q4KZdW9Ms9a3gwGBtGZJi42kGXldqMPBtVYFLZNwq5c9e4PNfJh+SXY4w1YFnjbjug891CDt2BDfLCD2bUJEXtYmQrYvARWQzWMOA7aGWVUTfk/RxjmOan0RDWIWXwI2xkQhcpw/ZzpsHhDVzsKcoJSJ+vk5F/PwPaQW6alimgsXdlg7PsyPzqmVZqM5WgUitUWBJcyHrKhM2aSITW3omD7yrOo7BS3iQbE8rYGUu4UkwUore6KFKRUVf25aVgoLsklHGCWPHpS/Bg4m9Jlff4fMDWxY/5JTdZn8VpQrt9lerPnBLVpfjKIo8zn+BpzrmsqUO3OpStXeE1SXUTpvxoypiM4MDt94saj3GzTQQ8RwG3MT7MssEf/m0YrCAW4JLxVHk+ytzLWQypdIqnE4k1/mg4lfPIZ1chXXkUZGainSeyRgXTzhsYW+nJaw44F9Yq885IV/9Ayy/SyXWMHf5wusxlzlln65xVMKa2vxowJ7lGoXfxNfZVjY+qM9ueAYLn/2zVO57jhksGgwKWMBbMX8joPrmACu2+CCf/Ro1+zjs9UFDFrBmGnnlch0oLDR4CPhFY4uqH9N2pwpL7Y9ZhZpL9EOihx04gB0ZIgtgfZONPLPltwj8WsKKdNLKJ0lbgRGnqnwsdypgtYgVlX/Z4r1si4pLg4+xuKqweMVim6warPX5AZZrUPmHH5kwrjV5KTT635qSHmC11bJsa6zL2LFG7eO2mnym5rDW1IkL5e+rrHEFvpqQD9o4fgKLp0wOG3npcQFLmvdfRGMXKQALFEbBx6GhtA+wZkbZtWRsky0oSORM0tBtqzEtYImiUz4q3+GlYsGay3rJww+EpTp/IB7g1mGdzLraF6Gtu8baRW7RYv1FjlzjFoojtzCwD2PiUEJB3xfcIk5y5JZ14Jb98dxyNj57CXNrUIXlC68K6Gd4sK9SyRY2Vypza5sPeZjPLe2ZtUel/AHW/siXfG4h5XPrIyzDE01YiF5PKg/A9QUGCzQ4YacqLM3iWAHQhPDEy+U4VsWANW4RFGotURO6Hpi+/k46wJopuJOcrQYwL9lyIKAmND6mj/C5gkeCYalMNja7Aha3MYjI1i3xBRcxYS5jVyuANcDrhC6RUH1j15d83VKZUD5KQQlrquOpIUDeN7RFTfz8rCN/VAeNKiwlXfX7/ZDzTSqqaZy0g0kJixvYCAsNR3sYJ3OFtUzqadJiuVym8dKi5i6Jh4ErfeFYF26r1+Sae3LglrCmdNSO41R1hQyMGK0fD1qSGww+HhavmKb5NMV2GTzVgu+KNOdKWFxqFTYhNW1d46Uuswl5DW4Zpf4PmZcDR+IpswmbFuENZ+QQ/sAtYRCIPFqTmByLHLAJnY+yCQtYRaEPMMIF+o4afAHWtuvyChpPRrEfcPGE8zwNeDC9eaIk7CANNPpFM+WS/MQT4jAR5aIAM34uT5+S3IKH0Q9tcAqoK68LCx5seG39UbWUYSC1Sm6x9BUzMIS2aWqG3h0ALGVfFFTndRepYkma3mVHRjwrhFBCUB4T5m8ZZa58vDYNTbW6EfO3RghLSC3w1L6vmRKcmeBv2R/jbzFqNgv/t/SOs8KT7S3GqKXg/eJKP/eOw2VvEeU5Lu94C/OOl81DaUYW/dVrJ6wD1NE7XvZyvxqVZ9r7KO+4FrrXuAwLIP3KZZcRqpM//SaRp0/6pN+IhFr6tX44Jfv/DpZw8iN/Wfkl87Lza/zjn6pvCFz1qsvBCCcXHFWbULlAEM6vfruspywi8tVvECp3sB+rcqzL/qqwEMJjMiPpdcRtD3+P+/28g6z3Nll3Hwfs7VVhxgtRv19E1bNBceu43z+tZhV8NI5XSb5iC14fY3PMXD5c4R0kDk/nFry4uQmbm03T58LNhl2H63UI75SGgdd/fO0VwxCS4ePjMPerg6JXhf9kly1GZgebMg0MAga088Zxy4bDKqSTH7pMiTFa4G3rotGZ/6djF/ZHpBX4nkej04b2Qra2TVN36I6dsRs3LMsyTeupkhEarsoHPsRQ3LiB5x0EwajJTf8YdX3gx7Th/AFPa9hosNFEoi7Jkr7GZ+kvHEWSFBYr5ngnr0rywQPPB+R3g2aJivKSIVH0j5YmcxdjmfBUknlqo5PUshc5rJYsFw99/lCwq6ecnbknFP0zqYEtKIQ4yHfZVAusnwsHQfADvLc4R5TKYGftNP0N5GxCNNx73VbQp+ZWMEBKKI/nEPlzLIOGb3BwZPBjfAprzMLGeBixQ13n9T+PuvKK5Z0Iy381RI3u9hbl0ftpUZvlBxgsBjBWjF0u5JewMoCljmzZJXAvg4VugHKEJeyDIky/clo5LBo4jgPc4hKLak1sQWzh88thbWz4QNoiFh7T+GaJVNcMk3fxfADs9Igf7FsICz9zLtP8rJFXSWR9fzateQlr7PDaI4h9pPBiF4MUPMshHGENTeqEN7gFsJyBN92ZVIYvAFhylvlZdlQTnmhM8l+6ssNg0VYMhFaw8CppC39LTCZjDJbwbPDm0PO9pfo3F+Jpc1HmLU3RNRAWL2MuIocFbAaXHZsZY8y/bNjr9UpYPfDs2OHgSwuPxWlRl2L3W79FGCzB+wESkb4DK2ZjEoErcUCN4o3yithiniXMoO9u4CEs+Xi83VTnpZ1ExewAyxvlR8jBewtsmc36kIALi8Nnxc+t7MitoSoR4zkXgcDPNSn8YLC8LjXzHRQZxfgKwOKJuznAwrYMstx9H5bAbam24JrBxSG58I3SYy4wLuI7gYXt2iQ3j3FgQPiZpdyKLcAh9yrLj/lg1wS+GBsF8DB5yrkFHu5iTlCQUoW0jk+SwQp13inOKPmGEZMWpTIvdTyhFMK5Nu9pAUve3eYW9wYTAlta0/2+U41otk2eRaWw7TVGDUAIu8PZsFDQA53w8p47whoq5LB9xeuSvEmewM00eBgwt3YGry5KWJHtTCMde5j9pUm9M1hxIKrFUgU3z2FuiTtT1F79Lzms+MVMY5zA78Ma2FRmnboJ+V6tDu1J2Lsxb7SJN6PK0Mwyagyziy8zf0wIn6XjKbuhXJwkLODGEJEDBelNcOpRJoTCXHOzkMpdgfvLuITluEoJy2Cw1HihUmW3J0zBDxWnyXWIjde8A2tawBIVZVSFNSFEpkHoKUTiUfwAlijLfL7cCNiosgwIM27NybFZd2hQZ1NyVaQc9gv01iBKPMACpW6ispzLMOtS9VIIbbFc0+ZMCIkVC/BQ8LwwPLF5rU18wGYt34e1NMkWYZG3druyasEwnidEGS5VaUdx4oEQ8ttt6xCR5A+HOzNYC+mYbAl56hRGTR+TmDzGSlmrFSaE8LwT3OADYx6DssvNKaGE5a1Fs1i9eQqCirC4bIs18AgLhHeFSxfpvAdLEPaa9NeFyhC4pq224VHDkjpqihRU4YnK8LuybIjSlhmEDBY8nU5pjoLSyjWwwO0kmHIAC8/Ue6AMlt8ltNNqdSgNsqZFy2OKwBrsMyvjUStCan0Tw3oMFseOwkBYsOJtW62WSEfJe9xKLcoUPG+cvA8orL7QAQtGmnNfyPfkFFZqyduhWhhFbG5NA5ElKoGaXE+T85F5Jg/SksPiohGDxZrlAvEivDWBaYjitHn9VlmO2THhA4WKIlfA4pJARFgbsD2oDDezw5kRFp6f6x0Md4BlTb1kYVLsiQ7rVt6VWihN/rYCctS3eDqacgssd6jCCil1VthwGds25tzyNUry9H8KsuW4JlvEXjW+sSlgwWfq2IvpUaNBAwiU7xZG6/IvP563+ktpPAn+V1nUpNevJhhPUQlL4MYjSkJY8aiDNz8QbJ3bM3gZjFmL+BVYsmFZoOYasATEDjw7oD8Odn5PG4UwPwnL71ugDkBlrJ+B5k1sKyV/xYb4FB9ZDguXYGK0x+mPYMH5HcKbkyjaKi4+i4Jb8KEvnWyjg8XhA23AGEu4obPmiURENHX7hamrE5Fi00cT0wMFt+DdQA79tazHeDOYtPaKdaYFS1Z0q7CYLSo3cIVBmxAvOGzGEyaSC0orZVUCsAZMmKkrSZocbHD2s7MZX428RzGDxW1lnldsE1d3bhAQKsFT5OkTcFBVncLNmqz94Sj4T+6lvdrO3xy3aOBh09IDcHc5stnaN7ANPPoyeEXZ+dN6iPObh41w9WTPWQEWl470Ltf7zk70U+UjrLWlqqYV/GBR3jg/8U9tlLA815iA7+EZFtzRHMkSCBar1RHtWNgZ0hy/MVao1IGvM5kFH9K8R6WNK9FyxLa5yA2cb+32W3l6dJql7XYs5NZ7u40Tfrp3bHuC103b7dxuCXu67axz7xOuL9fKvrdqt6e5ax2234ZZ1M6p/HjQZXB5O42K/Gk4LC6Ii8m3sY2/UbH9jeaZD1MlA4D0LMwAAACFSURBVF3McJnNaVBumBoqFMyJtqqxaoasN7Ity8lP3hlgzUqwLfOzJ+73iUeOPkfecf/ErWdO/6lXL5xecY1uOf3Vt/OYZxH5PIlDnL/gigvDcTTwysuTcc39NT/pkz7pkz7pkz7pkz7pkz7pkz7pkz7pkz7pkz7pkz7pkz7pkz7pg+n/AKWh2/ddVUFlAAAAAElFTkSuQmCC"
            alt="Logo"
            className="w-40 h-40 object-contain mb-6"
          />
          <h1 className="text-3xl font-bold text-neutral-800">Sistema de Evaluaciones de Exposiciones</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              placeholder="dembow@correo.com"
              className="w-full rounded-xl bg-white text-neutral-900 border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400 transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
                placeholder="********"
                className="w-full rounded-xl bg-white text-neutral-900 border border-neutral-300 pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-neutral-400 transition-shadow"
                required
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-900 transition-colors text-white py-3 font-semibold disabled:opacity-70 flex justify-center items-center mt-2"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Ingresando...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}