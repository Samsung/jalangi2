// obtained from http://www.webestools.com/scripts_tutorials-code-source-8-javascript-calculator-buttons-calculator-keyboard-support-operations-modulo.html

calc_array = new Array();
var calcul=0;
var pas_ch=0;
function $id(id)
{
    return document.getElementById(id);
}
function f_calc(id,n)
{
    if(n=='ce')
    {
        init_calc(id);
    }
    else if(n=='=')
    {
        if(calc_array[id][0]!='=' && calc_array[id][1]!=1)
        {
            eval('calcul='+calc_array[id][2]+calc_array[id][0]+calc_array[id][3]+';');
            calc_array[id][0] = '=';
            $id(id+'_result').value=calcul;
            calc_array[id][2]=calcul;
            calc_array[id][3]=0;
        }
    }
    else if(n=='+-')
    {
        $id(id+'_result').value=$id(id+'_result').value*(-1);
        if(calc_array[id][0]=='=')
        {
            calc_array[id][2] = $id(id+'_result').value;
            calc_array[id][3] = 0;
        }
        else
        {
            calc_array[id][3] = $id(id+'_result').value;
        }
        pas_ch = 1;
    }
    else if(n=='nbs')
    {
        if($id(id+'_result').value<10 && $id(id+'_result').value>-10)
        {
            $id(id+'_result').value=0;
        }
        else
        {
            $id(id+'_result').value=$id(id+'_result').value.slice(0,$id(id+'_result').value.length-1);
        }
        if(calc_array[id][0]=='=')
        {
            calc_array[id][2] = $id(id+'_result').value;
            calc_array[id][3] = 0;
        }
        else
        {
            calc_array[id][3] = $id(id+'_result').value;
        }
    }
    else
    {
        if(calc_array[id][0]!='=' && calc_array[id][1]!=1)
        {
            eval('calcul='+calc_array[id][2]+calc_array[id][0]+calc_array[id][3]+';');
            $id(id+'_result').value=calcul;
            calc_array[id][2]=calcul;
            calc_array[id][3]=0;
        }
        calc_array[id][0] = n;
    }
    if(pas_ch==0)
    {
        calc_array[id][1] = 1;
    }
    else
    {
        pas_ch=0;
    }
    document.getElementById(id+'_result').focus();
    console.log(document.getElementById(id+'_result').value);
    return true;
}
function add_calc(id,n)
{
    if(calc_array[id][1]==1)
    {
        $id(id+'_result').value=n;
    }
    else
    {
        $id(id+'_result').value+=n;
    }
    if(calc_array[id][0]=='=')
    {
        calc_array[id][2] = $id(id+'_result').value;
        calc_array[id][3] = 0;
    }
    else
    {
        calc_array[id][3] = $id(id+'_result').value;
    }
    calc_array[id][1] = 0;
    document.getElementById(id+'_result').focus();
    console.log(document.getElementById(id+'_result').value);
    return true;
}
function init_calc(id)
{
    $id(id+'_result').value=0;
    calc_array[id] = new Array('=',1,'0','0',0);
    document.getElementById(id+'_result').focus();
    console.log(document.getElementById(id+'_result').value);
    return true;
}
function key_detect_calc(id,evt)
{
    if((evt.keyCode>95) && (evt.keyCode<106))
    {
        var nbr = evt.keyCode-96;
        add_calc(id,nbr);
    }
    else if((evt.keyCode>47) && (evt.keyCode<58))
    {
        var nbr = evt.keyCode-48;
        add_calc(id,nbr);
    }
    else if(evt.keyCode==107)
    {
        f_calc(id,'+');
    }
    else if(evt.keyCode==109)
    {
        f_calc(id,'-');
    }
    else if(evt.keyCode==106)
    {
        f_calc(id,'*');
    }
    else if(evt.keyCode==111)
    {
        f_calc(id,'/');
    }
    else if(evt.keyCode==110)
    {
        add_calc(id,'.');
    }
    else if(evt.keyCode==190)
    {
        add_calc(id,'.');
    }
    else if(evt.keyCode==188)
    {
        add_calc(id,'.');
    }
    else if(evt.keyCode==13)
    {
        f_calc(id,'=');
    }
    else if(evt.keyCode==46)
    {
        f_calc(id,'ce');
    }
    else if(evt.keyCode==8)
    {
        f_calc(id,'nbs');
    }
    else if(evt.keyCode==27)
    {
        f_calc(id,'ce');
    }
    return true;
}

document.getElementById('calc').onload=init_calc('calc');

